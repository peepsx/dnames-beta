import React, { Component } from 'react'
import { Input, Icon, Label, Dimmer, Loader, Segment } from 'semantic-ui-react'
import FadeIn from 'react-fade-in'
import MasterConfig from '../../config/Master'
import ResultCard from '../blocks/ResultCard'
import SuccessModal from '../blocks/SuccessModal'
import RandomWordButton from '../blocks/RandomWordButton'
// import bg from '../../images/logo.png'
import peepsPNG from '../../images/dnames.png'
import Swal from 'sweetalert2'




const DefaultLoader = (props) => (
    <Dimmer
        active={props.active}
        page={true}>
        <Loader />
    </Dimmer>
)


class Home extends Component {

    state = {
        searchTerm: '',
        searchTermFinish: '',
        searchLoading: false,
        searchResponse: {},
        accountPrice: '',
        extraPrice: '',
        successModalOpen: false,
        inputError: false,
        showLandingTitle: true, // show "got your Arisen account on page load"
        dropDown: ".dcom",
        active: false
    }

    componentDidMount() {
        // get pricing.
        fetch(`${MasterConfig.httpEndpoint}/price`)
            .then(response => response.json())
            .then((pricing) => {
                this.setState({ accountPrice: pricing.price, extraPrice: pricing.extraPrice })
            });
        // run search automatically if present in url hash.
        // let hashName = window.location.hash.replace("#","")
        // if(hashName.length <= MasterConfig.requiredChars) this.onSearchChange({target: {value: hashName}})
    }


    runSearch = () => {
        var dcomPrice = 5.00
        var dnetPrice = 3.00
        var dorgPrice = 2.50
        var dinfoPrice = 1.00
        var dweb = 25.00
        if (this.state.dropDown == ".dcom") {
            localStorage.setItem("selecteddltdprice", dcomPrice)
            localStorage.setItem("selecteddltdname", this.state.dropDown)
            localStorage.setItem("dltdname", "DCOM")
            this.setState({ extraPrice: dcomPrice })

        } else if (this.state.dropDown == ".dnet") {
            localStorage.setItem("selecteddltdprice", dnetPrice)
            localStorage.setItem("selecteddltdname", this.state.dropDown)
            localStorage.setItem("dltdname", "DNET")
            this.setState({ extraPrice: dnetPrice })

        } else if (this.state.dropDown == ".dorg") {
            localStorage.setItem("selecteddltdprice", dorgPrice)
            localStorage.setItem("selecteddltdname", this.state.dropDown)
            localStorage.setItem("dltdname", "DORG")


            this.setState({ extraPrice: dorgPrice })

        } else if (this.state.dropDown == ".dinfo") {
            localStorage.setItem("selecteddltdprice", dinfoPrice)
            localStorage.setItem("selecteddltdname", this.state.dropDown)
            localStorage.setItem("dltdname", "DINFO")

            this.setState({ extraPrice: dinfoPrice })

        } else if (this.state.dropDown == ".dweb") {
            localStorage.setItem("selecteddltdprice", dweb)
            localStorage.setItem("selecteddltdname", this.state.dropDown)
            localStorage.setItem("dltdname", "DWEB")
            this.setState({ extraPrice: dweb })

        }
        if (this.state.searchTerm == "" || this.state.searchTerm == null) {
            Swal.fire({ icon: 'error', title: 'Oops...', text: 'Enter your domain name.' })
        } else {
          

            const domain = this.state.searchTerm.concat(this.state.dropDown)
            // hide landing page title
            if (this.state.showLandingTitle) this.setState({ showLandingTitle: false })

            let letters = /^[1-5a-z.]+$/;



            if (domain.match(letters) || domain === '') {
                // save search term so far.
                this.setState({ inputError: false })
                this.setState({ active: true })
                // set url hash.
                window.location.hash = `#${domain}`
                // run search
                fetch(`${MasterConfig.httpEndpoint}/lookup/${domain}`)
                    .then((response) => {
                        this.setState({ active: false })
                        return response.json()
                    })
                    .then((searchResponse) => {
                        this.setState({ searchResponse, searchLoading: false })
                    });

            } else {
                // illegal char entered.
                this.setState({ inputError: true ,active: false})
            }


        }

    }

    onSearchChange = (event) => {
        const domainname = event.target.value;
        this.setState({ searchTerm: domainname })
        // only allow alphanumeric chars.
        let letters = /^[1-5a-z]+$/;

        if (this.state.searchTerm.match(letters) || this.state.searchTerm === '') {
            // save search term so far.
            this.setState({ inputError: false })

            // if the value suplied is the correct length, run search.
            // if(value.length===MasterConfig.requiredChars) {
            //     // trigger search run.
            //     this.setState({searchLoading: true, searchResponse: {}})
            //     this.runSearch(value)
            // }
        } else {
            // illegal char entered.
            this.setState({ inputError: true })
        }
    }

    handleChange = (event) => {
        this.setState({ dropDown: event.target.value });

    }

    showSuccessModal = () => {
        // final step of checkout.
        // resets search input & search term.
        // shows successmodal.
        this.setState({ searchResponse: {}, searchTerm: '', successModalOpen: true })
    }

    onGenRandomWord = () => {
        this.setState({ searchLoading: true })
        fetch(`${MasterConfig.httpEndpoint}/word/${this.state.searchTermFinish}`)
            .then((response) => {
                return response.json()
            })
            .then((wordResponse) => {
                // turn off nameloading
                this.setState({ searchLoading: false })
                // run search with a random word.
                this.onSearchChange({ target: { value: wordResponse.word } })
            });
    }

    onFinishRandomWord = () => {
        let { searchTerm, searchTermFinish } = this.state
        if (!searchTermFinish.length)
            // copy search term so far, then run random word generator
            this.setState({ searchTermFinish: searchTerm }, this.onGenRandomWord)
        else
            // just run finish word generator (with already saved word)
            this.onGenRandomWord()
    }

    shouldShowFinishButton = () => {
        // the finish random button is showed IF,
        // we already finishing random words - OR - the search term exists and isn't the maximum length.
        let { searchTerm, searchTermFinish } = this.state
        return Boolean(
            searchTermFinish.length ||
            (searchTerm.length > 0 && searchTerm.length < MasterConfig.requiredChars)
        )
    }

    clearSearchTermFinish = () => {
        // resets the finish random word.
        this.setState({ searchTermFinish: '' })
    }

    render() {
        return (
            <div style={{ textAlign: 'center', paddingTop: '0.3em' }}>
                <DefaultLoader active={this.state.active} />


                <img src={peepsPNG} alt='logo' className='signup_logo'></img>
                <hr />
                {this.state.showLandingTitle ?
                    <div className="signup_text">
                        <h3><Icon name='user' /> Search for a domain below</h3>
                    </div> : null}

                <ResultCard
                    accountPrice={this.state.accountPrice}
                    extraPrice={this.state.extraPrice}
                    searchResponse={this.state.searchResponse}
                    showSuccessModal={this.showSuccessModal}
                />
                <br />

                <FadeIn transitionDuration={800}>
                    {this.state.inputError ?
                        <FadeIn>
                            <Label color='red'>
                                Lowercase letters (a-z) and numbers (1-5) only.
                            </Label>
                            <br />
                        </FadeIn>
                        : null}

                    <div>
                        <Input
                            size='huge'
                            icon='search'
                            placeholder='i.e. MyCompany'
                            onChange={this.onSearchChange}
                            // maxLength={MasterConfig.requiredChars}
                            style={{ backgroundColor: 'transparent', marginBottom: '0.25em', marginRight: '20px' }}
                            value={this.state.searchTerm}
                            loading={this.state.searchLoading}
                            disabled={this.state.searchLoading}
                            error={this.state.searchResponse.success}
                            autoFocus={true}
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                        />

                        <select class="drop-btn" value={this.state.dropDown} onChange={this.handleChange}>
                            <option value=".dcom">.dcom</option>
                            <option value=".dnet">.dnet</option>
                            <option value=".dorg">.dorg</option>
                            <option value=".dinfo">.dinfo</option>
                            <option value=".dweb">.dweb</option>
                        </select>
                    </div>

                    <br />
                    <span>
                        {/* {this.state.searchTerm.length}/{MasterConfig.requiredChars} characters.
                        &nbsp; &nbsp;
                        <RandomWordButton
                            onGenRandomWord={this.onGenRandomWord}
                            onFinishRandomWord={this.onFinishRandomWord}
                            showFinish={this.shouldShowFinishButton()}
                            searchTermFinish={this.state.searchTermFinish}
                            reset={this.clearSearchTermFinish}
                        /> */}
                        <button onClick={() => this.runSearch()} class="checkdomain">
                            Check Availability
                        </button>
                    </span>

                </FadeIn>

                <div className="spacer" />
                <SuccessModal open={this.state.successModalOpen} />

            </div>
        );
    }
}

export default Home
