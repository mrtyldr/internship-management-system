import apiService from '@/pages/api/user/[id]'

export async function getServerSideProps() {
    // Fetch data from external API
    const res = await fetch('http://localhost:3000/api/user/1')
    console.log('osman', res)
    const userInfo = await res.json()
    // Pass data to the page via props
    return {props: {userInfo}}
}

export default function User({userInfo}) {
    console.log(userInfo)
    return <div>User</div>
}