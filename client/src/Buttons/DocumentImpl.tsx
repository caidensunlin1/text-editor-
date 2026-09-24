import Button from "./Button";


function DocumentImpl(props: Button){
    return(<div>
        <textarea style={{
            width: `${props.width}px`,
            height: `${props.height}px`,
            resize: "none",
            margin: "0 auto",
            display: "block",
            outline: "none",
            border: "1px solid rgba(92, 87, 87, 0.55)",
            marginTop: "20px",
            fontFamily: `"Times New Roman", Times, serif`,
            fontSize: "16px",
            padding: "16px",
            lineHeight: "2"
        }}>
        </textarea>
    </div>);
}
export default DocumentImpl