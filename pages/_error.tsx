import Err from 'next/error'

function Error({ statusCode }) {
    return <Err statusCode={statusCode}/>
  }
  
  Error.getInitialProps = ({ res, err }) => {

    console.log(res.statusCode)
    res.statusCode = 404
    // const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    const statusCode = 404
    return { statusCode }
  }
  
  export default Error