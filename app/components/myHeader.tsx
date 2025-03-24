import Link from "next/link";

const MyHeader = () => {
    return (
        <header>
            <div className="container">
                <nav>
                    <Link className="link" href="/">Home</Link>
                    <Link className="link" href="/products">Products</Link>
                    <Link className="link" href="/create">Create</Link>
                </nav>
            </div>
      </header>
    )
}

export default MyHeader;