import React from "react";
import Header from "../Header";
import style from './Layout.module.scss'

const Layout: React.FC = ({children}) => {
    return (
        <div className={style.layoutWrapper}>
            <Header/>
            <div className={'content'}>
                <main>
                    {children}
                </main>
            </div>
        </div>
    )
}

export default Layout;