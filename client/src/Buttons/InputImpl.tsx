import Input from "./Input";


function InputImpl(props:Input){
    // To do add some condion and some way to map this to a pop up when we get there.
    // maybe look into null design pattern. 
    const borderVal: string = (typeof props.border === "string")? props.border:"none";
    const rightMargin: number = (typeof props.marginRight === "number")?
                                 props.marginRight:0;
    return(
        <div style={{
            marginRight: `${rightMargin}px`,
        }}>
        <input
            type="text" 
            placeholder= {props.startingText}
            style={{
            cursor: "text",
            border: `${borderVal}`,
            borderRadius: "5px",
            width: `${props.width}px`,
            height: `${props.height}px`
        }}>
        </input>
        </div>
        ); 
}
export default InputImpl