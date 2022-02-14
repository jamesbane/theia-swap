import style from './Header.module.scss'
import {Link, useLocation} from "react-router-dom"
import cn from 'classnames'

const Header = () => {
    const location = useLocation();
    return (
        <div className={style.headerWrapper}>
            <div className={'content'}>
                <div className={style.headerContainer}>
                    <Link to={'/'} className={style.headerLogo}>Theia</Link>

                    <div className={style.navLinks}>
                        <Link className={cn(style.navItem, {
                            [style.active]: location.pathname === '/'
                        })} to={'/'}>Event Filter</Link>
                        <Link className={cn(style.navItem, {
                            [style.active]: location.pathname === '/swap'
                        })} to={'/swap'}>Swap</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header;