import { Button } from '@mui/material';

function ClickyButton() {


    const doStuff = () => {
        console.log("clikc click");
    }




    return (
        <>
            <Button onClick={doStuff} > click click</Button>
        </>
    )
}


export default ClickyButton;