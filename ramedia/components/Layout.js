import Navbar from "./Navbar"
import Footer from "./Footer"

export default function Layout({ children }) {
    return (
        <>
            <Navbar></Navbar>
            
            {/* Offset of the Navbar */}
            <div className="h-14" />
            {children}
            <Footer></Footer>
        </>
    )
}