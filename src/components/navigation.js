//style={{color: "white",fontSize:35,fontWeight:"bold",fontFamily: "Playfair Display"}}
export const Navigation = (props) => {
    return (
        <nav id='menu' className='navbar navbar-default navbar-fixed-top '>
            <div className='container'>
                <div className='navbar-header'>

                    <a href='#page-top' className='navbar-brand'>UK Equity Screener
                    </a>{' '}
                </div>

                <div
                    className='collapse navbar-collapse'
                    id='bs-example-navbar-collapse-1'>

                    <ul className='nav navbar-nav navbar-right '>
                        <li>
                            <a href='#guide' className='page-scroll'>
                                User Guide
                            </a>
                        </li>
                        <li>

                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
