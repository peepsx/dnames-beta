import React, { Component } from 'react'
import { Input, Button, Modal, Icon, Divider, Loader, Dimmer } from 'semantic-ui-react'
import ecc from 'arisenjs-ecc'
import MasterConfig from '../../config/Master'
import ApiKey from "./Api"
import Swal from 'sweetalert2'
import successModal from "./SuccessModal"
import peepsPNG from '../../images/dnames.png'
import { PayPalButton } from "react-paypal-button-v2";
import CoinbaseCommerceButton from 'react-coinbase-commerce';
import 'react-coinbase-commerce/dist/coinbase-commerce-button.css';
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { PrivateKey, /**PublicKey */ } from '@arisencore/ecc';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ethers = require('ethers');


const DefaultLoader = (props) => (
    <Dimmer
        active={props.active}
        page={true}>
        <Loader />
    </Dimmer>
)

const paypalstyle = {

    color: 'blue'

}

class PayButton extends Component {

    state = {
        open: false,
        isLoading: false,
        wantsExtra: false,
        domainPrice: 5,
        radiobutton: "",
        domainName: ".com",
        paymentType: "",
        mode: 1,

        ownerPrivate: '',   // owner prv/pub key pair
        ownerPublic: '',
        activePrivate: '',  // active prv/pub key pair
        activePublic: '',
        copied: false, // Copy the key pairs,
        passPhraseCopied: false,
        mnemonic: [],
        active: false,
        transectionID: "",
        dltd: "",
        smallmodal: false,
        buttonId:""

    }

    componentDidMount() {

        const price = localStorage.getItem('selecteddltdprice')
        this.setState({ domainPrice: price })
        const name = localStorage.getItem('selecteddltdname')
        const dltd = localStorage.getItem('dltdname')
        this.setState({ domainName: name, dltd: dltd })
        this.memKey();
    }

    open = () => { this.setState({ open: true }) }
    close = () => { this.setState({ open: false }) }
    closemodal = () => {
        this.setState({ smallmodal: false }, () => {
            window.location.reload()
        })
    }



    showActive = () => { this.setState({ showActivePair: true }) }

    textCopy = (text) => {
        if (text) {
            this.setState({ copied: text })
            setTimeout(() => {
                this.setState({ copied: false })
            }, 2000)
        }
    }

    passPhrase = (text) => {
        if (text) {
            this.setState({ passPhraseCopied: text })
            setTimeout(() => {
                this.setState({ passPhraseCopied: false })
            }, 2000)
        }
    }

    memKey = () => {
        let wallet = ethers.Wallet.createRandom();
        let Mnemonic_List = wallet.mnemonic
        this.setState({
            mnemonic: Mnemonic_List.split(" "),
            mnemonic_list: Mnemonic_List
        }, () => {
            this.genKeyPair('owner');
            this.genKeyPair('active');
        })

        //this.genKeyPair('owner');
        //this.genKeyPair('active');
    }

    genKeyPair = (genType = 'owner') => {
        // generates a public private key pair.
        // set loading.
        this.setState({ [`${genType}Loading`]: true })
        let master = PrivateKey.fromSeed(this.state.mnemonic_list)
        let ownerPrivate = master.getChildKey('owner')
        let activePrivate = ownerPrivate.getChildKey('active')

        // ecc.randomKey().then(privateKey => {
        //     let publicKey = ecc.privateToPublic(privateKey)
        if (genType === 'owner') {
            // save for owner
            this.setState({
                ownerPrivate: ownerPrivate,
                ownerPublic: PrivateKey.fromString(ownerPrivate.toWif()).toPublic().toString(),
                ownerLoading: false
            })
        } else {
            // save for active
            this.setState({
                activePrivate: activePrivate,
                activePublic: PrivateKey.fromString(activePrivate.toWif()).toPublic().toString(),
                activeLoading: false
            })
        }
        // })
    }

    wantsExtra = () => {
        let { wantsExtra } = this.state
        this.setState({ wantsExtra: !wantsExtra })
    }

    getName = () => {
        // add a plus to the order name (if extra stake is wanted).
        let { wantsExtra } = this.state
        let { name } = this.props
        return wantsExtra ? `${name}+` : name
    }

    getPrice = () => {
        let { wantsExtra } = this.state
        let { accountPrice, extraPrice } = this.props
        return wantsExtra ? accountPrice + extraPrice : accountPrice
    }

    getCheckout = () => {
        let { ownerPublic, activePublic } = this.props
        let name = this.getName()
        // set loading status.
        // this.setState({isLoading:true})
        this.setState({ open: true })
    }

    radio1 = () => {
        this.setState({ radiobutton: "paypal", paymentType: "Paypal" })
    }

    radio2 = () => {
        this.setState({ radiobutton: "cryptocurency", paymentType: "Crypto" })
    }

    registerDomain = () => {
        fetch(ApiKey.registerApi, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                domainName: this.props.name,
                owner: this.state.ownerPublic,
                active: this.state.activePublic,
                dltd: this.state.dltd,
                transaction_ID: this.state.transectionID,
                paymentMode: this.state.paymentType,
                buttonID: this.state.buttonId
            })
        }).then(response => response.json())
            .then((data) => {
                if (data.success === true) {
                    this.setState({ smallmodal: true })
                }
            })
            .catch((err1) => {
            })
    }

    renderKeyInputs = (isOwnerRender) => {
        // generate inputs for active or owner keys.
        let genType = isOwnerRender ? 'owner' : 'active'
        let pubKey = isOwnerRender ? this.state.ownerPublic : this.state.activePublic
        let privKey = isOwnerRender ? this.state.ownerPrivate : this.state.activePrivate

        return (
            <div>
                {genType === 'owner' && <h3>Your 12 word backup phrase is: {" "}
                    <CopyToClipboard
                        text={this.state.mnemonic}
                        onCopy={(text, result) => {
                            this.passPhrase(text)
                        }}
                    >
                        <span><i className="fa fa-copy"></i></span>
                    </CopyToClipboard><br></br>
                    {this.state.passPhraseCopied ? <span style={{ color: 'red', fontSize: 14, marginLeft: 10 }}>Pass Phrase Keys Copied</span> : null}
                </h3>}{genType === 'owner' &&
                    <div className="random-mnemonic">
                        <span>1. {"  " + this.state.mnemonic[0]}</span>
                        <span>2. {"  " + this.state.mnemonic[1]}</span>
                        <span>3. {"  " + this.state.mnemonic[2]}</span>
                        <span>4. {"  " + this.state.mnemonic[3]}</span>
                        <span>5. {"  " + this.state.mnemonic[4]}</span>
                        <span>6. {"  " + this.state.mnemonic[5]}</span>
                        <span>7. {"  " + this.state.mnemonic[6]}</span>
                        <span>8. {"  " + this.state.mnemonic[7]}</span>
                        <span>9. {"  " + this.state.mnemonic[8]}</span>
                        <span>10. {"  " + this.state.mnemonic[9]}</span>
                        <span>11. {"  " + this.state.mnemonic[10]}</span>
                        <span>12. {"  " + this.state.mnemonic[11]}</span>
                    </div>
                }
                {this.state.showActivePair &&
                    <h3>
                        {genType} public key &nbsp;
                {/* <Button size='mini' onClick={() => {this.genKeyPair(genType)}}
                    loading={this.state[`${genType}Loading`]}>need one?</Button> */}
                        {/**pubKey ? <Button size='mini' icon='cancel' onClick={() => {this.onKeyReset(genType)}} /> : null */}
                        <CopyToClipboard
                            text={"PUBLIC_KEY - " + pubKey + " , PRIVATE_KEY - " + privKey}
                            onCopy={(text, result) => {
                                this.textCopy(text)
                            }}
                        >
                            <span><i className="fa fa-copy"></i></span>
                        </CopyToClipboard>
                        {"PUBLIC_KEY - " + pubKey + " , PRIVATE_KEY - " + privKey === this.state.copied ? <span style={{ color: 'red', fontSize: 14, marginLeft: 10 }}>Public & Private Key Copied</span> : null}
                    </h3>
                }
                <div className="spacer" />
                {
                    this.state.showActivePair &&
                    <Input
                        placeholder='RSN8mUGcoTi12WMLtTfYFGBSFCtHUSVq15h3XUoMhiAXyRPtTgZjb'
                        onChange={(e) => this.onKeyChange(e, genType)}
                        value={pubKey}
                        // onChange={({target: {value}}) => this.setState({value, copied: false})}
                        fluid
                        error={Boolean(pubKey.length) && !ecc.isValidPublic(pubKey)} // highlight if not empty and invalid
                    />
                }
                {
                    this.state.showActivePair &&
                    <Input
                        value={privKey}
                        onChange={({ target: { value } }) => this.setState({ value, copied: false })}
                        size='mini'
                        label={{ icon: 'key', color: 'green' }}
                        labelPosition='right corner'
                        fluid
                        disabled
                    />
                }

                <Modal closeIcon size='small' dimmer='blurring' closeOnDimmerClick={false} open={this.state.smallmodal} onClose={this.closemodal} className="cart-modal">
                    <Modal.Content>
                        <div className="comngrat-modl">
                            <h1 style={{ textAlign: "center" }}>Congratulations...</h1>
                            <h2 style={{ textAlign: "center" }}>Thank you for registering!</h2>
                            <h3 style={{ textAlign: "center" }}>Getting Started With Your New Domain.</h3>
                            <h3 style={{ textAlign: "center" }}>You can manage your domain via the command-line and the PeepsID app. Get started below.</h3>

                            <div className="cong-button-box">
                                <button className="download-btn"><a href="https://docs.dnames.network" target="_blank">Download PeepsID</a></button>
                                <button className="close-btn" style={{ marginLeft: "20px", backgroundColor: "#21ba45", color: "#fff" }} onClick={() => { window.location.reload() }}>Close</button>
                            </div>
                        </div>
                    </Modal.Content>

                </Modal>
            </div>
        )
    }

    render() {
        let { ownerPublic, activePublic, extraPrice, name } = this.props
        var checkoutid = ""
        if (this.state.dltd === "DCOM") {
            checkoutid = "fb700c5e-9b30-4c5b-a96e-18f9f3120fa6"
        } else if (this.state.dltd === "DINFO") {
            checkoutid = "192672b7-eb1d-4549-9e98-6b65081275ec"
        } else if (this.state.dltd === "DNET") {
            checkoutid = "9733e897-7271-471d-9648-93a76f4f3e26"
        } else if (this.state.dltd === "DORG") {
            checkoutid = "3b0e54c1-ecb1-4050-87ab-9a2a2394d341"
        } else if (this.state.dltd === "DWEB") {
            checkoutid = "ac224720-2abb-4974-b1c1-cf40bd5290ec"
        }else if (this.state.dltd === "D") {
            checkoutid = "5f1174d9-40b6-471c-af5d-6c9f7c2028b8"
        }

        // to submit, the `ownerPublic` key MUST be present AND valid.
        // an `activePublic` key is optional, but if present MUST be valid.
        let canSubmit = ecc.isValidPublic(ownerPublic)
            && (!activePublic.length || ecc.isValidPublic(activePublic))

        return (
            <div align={'center'}>
                <ToastContainer position="top-center" autoClose={50000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

                <div className="spacer" />
                <Button
                    positive
                    fluid
                    // icon='cart'
                    content={`Checkout`}
                    disabled={!canSubmit}
                    loading={this.state.isLoading}
                    onClick={this.getCheckout}

                />
                <div className="spacer" />

                <Modal closeIcon size='small' dimmer={'blurring'} closeOnDimmerClick={false} open={this.state.open} onClose={this.close} className="cart-modal">
                    <Modal.Content>

                        <div className="cart-table">
                            <div style={{ textAlign: 'center', paddingTop: '0.3em' }}>
                                <img src={peepsPNG} alt='logo' className='signup_logo'></img>
                                <hr />
                                {(() => {

                                    if (this.state.mode === 1) {
                                        return <div className="domain-pay">
                                            <div className="payment-heading">
                                                <h2>Select the payment method</h2>
                                            </div>

                                            <form action="">
                                                <input type="radio" id="radiobutton1" onChange={this.radio1} name="payment" value="Card"></input>
                                                <label for="Card">Pay With PayPal/Card</label><br></br>
                                                <input type="radio" id="radiobutton2" onChange={this.radio2} name="payment" value="Crypto"></input>
                                                <label for="Crypto">Pay With Cryptocurrency</label>
                                            </form>

                                            {
                                                (this.state.radiobutton === "paypal") ?

                                                    <PayPalButton
                                                        style={paypalstyle}
                                                        createOrder={(data, actions) => {
                                                            return actions.order.create({
                                                                purchase_units: [{
                                                                    amount: {
                                                                        currency_code: "USD",
                                                                        value: this.state.domainPrice
                                                                    }
                                                                }],
                                                                // application_context: {
                                                                //   shipping_preference: "NO_SHIPPING" // default is "GET_FROM_FILE"
                                                                // }
                                                            });
                                                        }}

                                                        // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                                                        onSuccess={(details, data) => {
                                                            this.setState({ active: true })
                                                            if (details) {
                                                                this.setState({ transectionID: details.id })
                                                                // OPTIONAL: Call your server to save the transaction
                                                                fetch(ApiKey.paypalPaymentApi, {
                                                                    method: "POST",
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({
                                                                        transactionId: details.id,
                                                                        amount: extraPrice,
                                                                        domainName: name,
                                                                        paymentStatus: details.status
                                                                    })
                                                                }).then(response => response.json())
                                                                    .then((data) => {
                                                                        if (data.status === true) {
                                                                            this.setState({ active: false })
                                                                            this.setState({ mode: 2 })
                                                                        }
                                                                    })
                                                                    .catch((err1) => {
                                                                    })
                                                            }

                                                        }}
                                                        catchError={(err2) => {

                                                            console.log("on err2 paypal",err2);

                                                        }}
                                                        options={{
                                                            // clientId:"AeSkIlCgK1bjX6UPr8w9fDyMD7F5WsuzJWWbgiNSyEi2BnU43V6j5kJbRCK87gk6uYi8HfpyYyCKAzK_",
                                                            clientId: "Aes7-mZ9lsMi3h-m6lZ-eIQFBaUoF_hpHW1fF8bEZ5a59vZvzeTg75ZZc78g5h5igwkSABHfvlDQk8VQ",
                                                            disableFunding:"card"

                                                        }}
                                                    /> : null

                                            }
                                            {
                                                (this.state.radiobutton === "cryptocurency") ?
                                                    <CoinbaseCommerceButton
                                                        style={{
                                                            width: '100%',
                                                            color: 'white',
                                                            backgroundColor: "#21ba45",
                                                            borderRadius: 4,
                                                            height: 40,
                                                            cursor: 'pointer',
                                                            border: "none",
                                                            text: "zz"
                                                        }}
                                                        checkoutId={checkoutid}
                                                        disableCaching={true}
                                                        onChargeSuccess={(chargesuccess) => {
                                                           // console.log("chargesuccess",chargesuccess)
                                                        }}
                                                        onChargeFailure={(chargefailure) => {  
                                                          //  console.log("chargefailure",chargefailure)
                                                          
                                                        }}
                                                        onPaymentDetected={(paymentdetected) => {
                                                           // console.log("paymentdetected",paymentdetected)

                                                            this.setState({ transectionID: paymentdetected.code ,buttonId:paymentdetected.buttonId })
                                                            if (paymentdetected.event) {
                                                                fetch(ApiKey.cryptoPaymentApi, {
                                                                    method: "POST",
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({
                                                                        code: paymentdetected.code,
                                                                        amount: extraPrice,
                                                                        domainName: name,
                                                                        paymentStatus: paymentdetected.event,
                                                                        buttonId: paymentdetected.buttonId
                                                                    })
                                                                }).then(response => response.json())
                                                                    .then((data) => {
                                                                        if (data.status === true) {
                                                                            this.setState({ active: false })
                                                                            this.setState({ mode: 2 })

                                                                        }
                                                                    })
                                                                    .catch((err1) => {
                                                                    })
                                                            }
                                                        }}
                                                        onModalClosed={(modalclosed) => {

                                                            console.log("modalclosed")

                                                        }}
                                                    />

                                                    : null

                                            }
                                        </div>
                                    }
                                    if (this.state.mode == 2) {

                                        return <div className="domain-pay">
                                            <h1><Icon name='user circle' /> {name}</h1>
                                            <p>This is your backup phrase that can be used to securely import your domain on any device. Please write this phrase down and keep it in a safe place.</p>
                                            <Divider />
                                            {this.renderKeyInputs(true)}
                                            <br />
                                            {this.state.showActivePair ? this.renderKeyInputs(false) :
                                                <Button size='mini' onClick={this.showActive}>+ Show Me The Keys</Button> /** this.renderKeyInputs(false) */}
                                            <button className="ui fluid positive button pay-button" style={{}} onClick={this.registerDomain} >Finalize Domain Registration</button>
                                        </div>

                                    }
                                    if (this.state.mode == 3) {

                                    }

                                })()}
                            </div>
                        </div>

                    </Modal.Content>
                </Modal>
            </div>
        )
    }


}


export default PayButton
