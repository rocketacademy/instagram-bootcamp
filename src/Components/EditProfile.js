export function EditProfile(props) {
    return (
        <div>
            <h3>{props.user.email}</h3>
            <h4>{props.user.uid}</h4>
            <input type='text'/>
            <input type='text'/>
        </div>
    )
}

export default EditProfile;