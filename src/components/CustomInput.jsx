

//--------------------------------------------

export const CustomInput = ({type, name, placeholder, onChange}) => {


    return (
        <>
    <input 
    type={type}
    name={name}
    placeholder={placeholder}
    onChange={onChange}
    >
    </input>

        </>
    )
}