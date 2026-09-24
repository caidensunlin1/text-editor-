import  "./EditingPageStyle.css"
import BackClicker from "../../Buttons/BackClicker";
import ForwardClicker from "../../Buttons/ForwardClicker";
import TitleInput from "../../Buttons/TitleInput";

function ToolBar(){
    return(
        <div className="tool-bar-border">
            <TitleInput height={25} width={200} marginRight={1}/>
            <BackClicker height={25} width={25} marginRight={1}/>
            <ForwardClicker height={25} width={25} marginRight={1}/>
        </div>
    );
}

export default ToolBar