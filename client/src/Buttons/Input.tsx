import Button from "./Button";

function Input(props:Button){
    // To do add some condion and some way to map this to a pop up when we get there.
    // To do change the untitled document default for later
    // maybe look into null design pattern. 
    if(props.icon !== ""){
       return(
            <div style={{
                width: `${props.width}`,
                height: `${props.height}`,
                marginRight: `${props.marginRight}px` 
            }}>
            <input 
                type="text" 
                placeholder="Untitled Document"
                style={{
                cursor: "text", 
                border: "none",
                borderRadius: "5px"
            }}>
            <img src={props.icon} />
            </input>
            </div>
        ); 
    }
    return(
        <div style={{
            width: `${props.width}`,
            height: `${props.height}`,
            marginRight: `${props.marginRight}px` 
        }}>
        <input 
            type="text" 
            placeholder="Untitled Document"
            style={{
            cursor: "text",
            border: "none",
            borderRadius: "5px"
        }}>
        </input>
        </div>
        ); 
}
export default Input