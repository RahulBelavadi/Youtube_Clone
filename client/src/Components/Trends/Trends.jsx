import React from 'react'
import './trend.css'
function Trends() {

     let trends = ['All', 'Musisssssssc', 'Gaming', 'Movies', 'Sports', 'News', 'Live', 'Fashion', 'Learning', 'Podcasts', 'Comedy', 'Cooking', 'Travel', 'Tech', 'Art', 'Science', 'Fitness', 'DIY', 'Business', 'Programming'];

  return (
    <>
    <div className="div">
            <div className="trends">
              {
                trends.map((item) => {
                  return <div className='items'><a href="">{item}</a></div>
                })
              }

            </div>
          </div>
    </>
  )
}

export default Trends