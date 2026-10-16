import { useEffect, useRef } from "react";
import Button from "./Button";
import { MAX_PAGE_CHARS } from "../Constants/EditingConstnats";


function DocumentImpl(props: Button){

    //Here In order to keep track of the user's inputs 
    // const textAreaRef = useRef<HTMLTextAreaElement>(null);
    
    // // function handleClick1(){
    // useEffect(() =>
    //     {
    //     // const textArea: React.RefObject<HTMLTextAreaElement | null> = textAreaRef;

    //     if(textAreaRef.current) {
    //         textAreaRef.current.value.length;
    //         textAreaRef.current.
    //     }
    //     }


    //     )
        
// onInput={(event) => {
//     const count = event.currentTarget.value.length;
//     console.log(count);
//   }}
    return(<div>
        <textarea maxLength={MAX_PAGE_CHARS}
            style={{
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