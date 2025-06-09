import React from 'react'
import './left.css'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { homeMenu, History, Explore } from './menuData';
import { useNavigate } from 'react-router-dom';


function Left() {

    const navigate = useNavigate();

    return (
        <div className="left">
            <div className="home">
                {
                    homeMenu.map((val, ind) => {
                        return <section key={ind} className='home-section'
                        onClick={() => val.path && navigate(val.path)}
                        >

                            <span className="icon">{val.icon}</span>
                            <span className="name">{val.name}</span>
                        </section>
                    })
                }
            </div>
            <div className='line'></div>
            <div className="you">
                You
                <KeyboardArrowRightIcon />
            </div>



            {/* <div className="home">

                {
                    History.map((val, ind) => {
                        return <section key={ind} className='home-section'>
                            <span className="icon">{val.icon}</span>
                            <span className="name">{val.name}</span>
                        </section>
                    })
                }
            </div> */}
            {/* <div className='line'></div> */}

            <div className="home">

                {
                    Explore.map((val, ind) => {
                        return <section key={ind} className='home-section'>
                            <span className="icon">{val.icon}</span>
                            <span className="name">{val.name}</span>
                        </section>
                    })
                }
            </div>

        </div>
    )
}

export default Left