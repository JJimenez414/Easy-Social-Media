import { useState, useEffect } from "react";
import Feedback from "../components/Feedback"
import Grade from "../components/Grade"
import Request from "./APIRequest";


function Description(props) {

  const [total, setTotal] = useState(0);
  const [audio_percentage, setPercentage] = useState(0);
  const [length_percentage, setLengthPercentage] = useState(0);
  const [resolution_percentage, setResolutionPercentage] = useState(0);
  const [l_seconds, setSeconds] = useState(0);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [mean, setMean] = useState(0);
  const [dips, setDips] = useState(0);
  const [peaks, setPeaks] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const handleSendData = async () => {
        setLoading(true)
        try {
          const result = await Request.sendData();
          await new Promise((resolve) => setTimeout(resolve, 2000))
          setPercentage(result.audio_percentage);
          setLengthPercentage(result.length_percentage);
          setResolutionPercentage(result.resolution_percentage);
          setDips(result.dips);
          setMean(result.mean);
          setPeaks(result.peaks);
          setSeconds(result.l_seconds);
          setWidth(result.width);
          setHeight(result.height);
          setTotal(result.audio_percentage + result.length_percentage + result.resolution_percentage);
          setLoading(false);
        } catch(e) {
          console.log(e);
        }
      };

      if (props.fileExists == true) {
        handleSendData();
      }

    }, [props.fileExists]);

  return ( 
    <>
      <div className="description"> 
        <Grade 
        grade={total + "%"}  
        loading={loading}
        />
      
        <div className="feedBacks">
          <Feedback 
            title="Length" 
            grade={length_percentage} 
            results={"Length: " + l_seconds + "s"} 
            description="We determine the length of the video by analyzing the meta data."
          />

          <Feedback 
            title="Resolution" 
            grade={resolution_percentage} 
            results= {"Width: " + width + " Height: " + height}  
            description="We determine resolution of the video by calculating the pixels inside the video frame.
                          Anything below 1920 can reduce user retention."
          />

          <Feedback 
            title="Audio Stableness" 
            grade={audio_percentage} 
            results={"Mean (DB LVL): " + mean + " Dips: " + dips + " Peaks: " + peaks}  
            description="The dips and mean are calculated in a 2 second period span."
          />
        </div>
      </div>
    </>
  )
}

export default Description;