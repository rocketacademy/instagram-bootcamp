export function Profile(props) {
    return (
        <div>
            <h3>{props.user.email}</h3>
            <h4>{props.user.uuid}</h4>
        </div>
    )
}