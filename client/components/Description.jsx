import { useState, useEffect } from "react";
import Feedback from "../components/Feedback"
import Grade from "../components/Grade"
import Request from "./APIRequest";


function Description(props) {

  const [total, setTotal] = useState(0);
  const [audio_percentage, setPercentage] = useState(0);
  const [length_percentage, setLengthPercentage] = useState(0);
  const [l_boolean, setlboolean] = useState(0);
  const [resolution_percentage, setResolutionPercentage] = useState(0);
  const [l_seconds, setSeconds] = useState(0);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [mean, setMean] = useState(0);
  const [dips, setDips] = useState(0);
  const [peaks, setPeaks] = useState(0);
  const [aspect_ratio, setAspectRatio] = useState(0);
  const [aspect_percentage, setAspectPercentage] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const handleSendData = async () => {
        setLoading(true)
        try {
          const result = await Request.sendData();
          await new Promise((resolve) => setTimeout(resolve, 2000))
          setPercentage(result.audio_percentage);
          setLengthPercentage(result.length_percentage);
          setlboolean(result.l_boolean);
          setResolutionPercentage(result.resolution_percentage);
          setDips(result.dips);
          setMean(result.mean);
          setPeaks(result.peaks);
          setSeconds(result.l_seconds);
          setWidth(result.width);
          setHeight(result.height);
          setAspectPercentage(result.aspect_percentage)
          setTotal(result.audio_percentage + result.length_percentage + result.resolution_percentage + result.aspect_percentage);
          setAspectRatio(result.aspect_ratio);
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
            title="Video Length" 
            grade={length_percentage} 
            results={
              l_boolean === 0 ? "Video length is " + l_seconds + "s, which is below recommended." : "The video length is " + l_seconds + "s, which is great for audiences."
            } 
            description="Attention span on social media is short. It’s the video’s job to get all the relevant info out in a very effective time. Length standard is less than 45 seconds."
          />

          <Feedback 
            title="Video Resolution" 
            grade={resolution_percentage}
            results= { resolution_percentage === 25 ? "Video meets resolution requirements at " + width + "x" + height + "." : "Video doesn't meet resolution requirements at " + width + "x" + height + "."} 
            description="Most social media platforms max out at 1080x1920 vertical resolution. This metric makes sure you have the best resolution to ensure the audience will stay engaged in your content."
          />

          <Feedback 
            title="Audio Stableness" 
            grade={audio_percentage} 
            results={"Video audio has " + dips + " dips & " + peaks + " peaks."}  
            description="Stable audio provides the audience an uninterrupted listening experience while watching your videos. Having audio volume dips and peaks in a video can and will make your audience click off."
          />

          <Feedback 
            title="Aspect : Ratio" 
            grade={aspect_percentage}
            results={
              aspect_ratio === 0 ? "Video meets aspect ratio standards." : "Content doesn't meet aspect ratio standards."
            }  
            description="The composition of  videos provide a visually appealing experience to audiences. A common problem with videos is the not so pleasing black bars that surround a video."
          />
        </div>
      </div>
    </>
  )
}

export default Description;