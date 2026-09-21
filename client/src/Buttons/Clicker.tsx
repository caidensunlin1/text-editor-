import Button from "./Button";

function Clicker(props:Button){
    
    return(
    <div style={{
        width: `${props.width}`,
        height: `${props.height}`,
        marginRight: `${props.marginRight}px`
    }}>
        <button style={{
           cursor: "pointer",
           border: "none" 
        }}>
        <img src={props.icon} />
        </button>
    </div>);
}

export default Clicker