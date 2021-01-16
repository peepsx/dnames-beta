import React, { Component } from 'react'
import { Button, Input, Icon, Modal, Divider } from 'semantic-ui-react'
import ecc from 'arisenjs-ecc'
import PayButton from './PayButton'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import 'font-awesome/css/font-awesome.min.css';
import { PrivateKey, /**PublicKey */ } from '@arisencore/ecc';
import peepsPNG from '../../images/dnames.png'
const ethers = require('ethers');

class BuyModal extends Component {

    state = {
        open: false,
        ownerPrivate: '',   // owner prv/pub key pair
        ownerPublic: '',
        ownerLoading: false,
        activePrivate: '',  // active prv/pub key pair
        activePublic: '',
        mnemonic: [],
        activeLoading: false,
        showActivePair: false, // show the active keypair
        copied: false, // Copy the key pairs,
        passPhraseCopied: false,
    }
    componentDidMount() {
        const price = localStorage.getItem('selecteddltdprice')
        // this.setState({domainPrice:price},()=>{

        // })
        this.memKey();
    }
    open = () => { this.setState({ open: true }) }
    close = () => { this.setState({ open: false }) }
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

    onKeyChange = (e, genType) => {
        // capture typing of public key.
        this.setState({ [`${genType}Private`]: '', [`${genType}Public`]: e.target.value })
    }

    onKeyReset = (genType) => {
        this.setState({ [`${genType}Private`]: '', [`${genType}Public`]: '' })
    }
    memKey = () => {
        let wallet = ethers.Wallet.createRandom();
        let Mnemonic_List = wallet.mnemonic

        // this.setState({
        //     mnemonic: Mnemonic_List.split(" ")
        // })

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

    renderKeyInputs = (isOwnerRender) => {

        // generate inputs for active or owner keys.
        let genType = isOwnerRender ? 'owner' : 'active'
        let pubKey = isOwnerRender ? this.state.ownerPublic : this.state.activePublic
        let privKey = isOwnerRender ? this.state.ownerPrivate : this.state.activePrivate

        return (
            <div>
                { this.state.showActivePair &&
                    <h3>
                        {genType} public key &nbsp;
               pubKey ? <Button size='mini' icon='cancel' onClick={() => { this.onKeyReset(genType) }} /> : null */ }
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

            </div>
        )
    }

    render() {
        let { searchResponse, accountPrice, extraPrice } = this.props
        return (
            <div>
                <Button
                    positive
                    fluid
                    size='big'
                    icon='checkmark'
                    labelPosition='right'
                    onClick={this.open}
                    content='Buy Domain Now'
                />
                <Modal closeIcon size='tiny' dimmer='blurring' closeOnDimmerClick={false} open={this.state.open} onClose={this.close} className="cart-modal">
                    <Modal.Content>

                        {/* <h1><Icon name='user circle' /> {searchResponse.account}</h1> */}

                        {this.renderKeyInputs(true)}

                        <div className="cart-table">
                            <div style={{ textAlign: 'center', paddingTop: '0.3em' }}>
                                <img src={peepsPNG} alt='logo' className='signup_logo'></img>
                                <hr />
                                <div className="domain-header">

                                    <div className="clearfix domain-detail">
                                        <div className="box box-head domain-title">Domain Name</div>
                                        <div className="box box-head">Price</div>
                                        <div className="box box-body box-domain">{searchResponse.account}</div>
                                        <div className="box box-body">${extraPrice}</div>
                                    </div>

                                    <table className="price-total">
                                        <tr>
                                            <td><b>Subtotal:</b></td>
                                            <td>${extraPrice}</td>
                                        </tr>
                                        <tr>
                                            <td><b>Total:</b></td>
                                            <td>${extraPrice}</td>
                                        </tr>

                                    </table>

                                </div>



                            </div>
                        </div>

                    </Modal.Content>
                    <Modal.Actions>
                        <PayButton
                            accountPrice={accountPrice}
                            extraPrice={extraPrice}
                            ownerPublic={this.state.ownerPublic}
                            activePublic={this.state.activePublic}
                            name={searchResponse.account}
                            closeBuyModal={this.close}
                            showSuccessModal={this.props.showSuccessModal}
                        />
                    </Modal.Actions>

                </Modal>
            </div>
        )
    }


}


export default BuyModal
