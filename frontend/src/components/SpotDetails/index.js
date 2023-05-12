import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchSingleSpot } from '../../store/spots';
import { fetchReviews } from '../../store/reviews';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem'
import CreateReview from '../CreateReview';
import DeleteReviewModal from '../DeleteReviewModal';

import './SpotDetails.css';

function GetSpotDetails() {
    const { spotId } = useParams();

    const sessionUser = useSelector(state => state.session.user);

    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(fetchReviews(spotId))
    }, [dispatch, spotId])

    useEffect(()=>{
        dispatch(fetchSingleSpot(spotId))
    }, [dispatch, spotId])

    const reviews = Object.values(useSelector(state=>state.reviews.spot))
    const spot = useSelector(state=>state.spots.singleSpots[spotId])
console.log("spotindetail:",spot)
console.log("reviews:", reviews)
    let reviewButtonClassName
    let reviewedUser = [];
    for(let review of reviews){
        reviewedUser.push(review.userId)
    }

    if(sessionUser && (sessionUser?.id !== spot?.ownerId) && (!reviewedUser.includes(sessionUser?.id))){
        reviewButtonClassName = "spotDetails4";
    }else{
        reviewButtonClassName = "spotDetails4" + " hidden";
    }

    if(!spot) return (<></>);
    let urls = [];
    if(spot.SpotImages){
        for(let i=0; i<5; i++){
            if(spot.SpotImages[i]){
                urls.push(spot.SpotImages[i].url)
            }else{
                urls.push('https://a0.muscache.com/im/pictures/ea555b8d-bb92-4528-9a0c-1659fc6358e7.jpg')
            }
        }
    }

    let rev = "";
    if(!spot.numReviews || spot.numReviews === 1) {
        rev = "review"
    }else {
        rev = "reviews"
    }

    for(let review of reviews){
        let time1 = new Date(review.createdAt);
        let time2 = time1.toString().split(" ");
        let date = time2[1] + " " + time2[3];
        review.createdAt = date;
    }

    return (
        <div className='spotDetails'>
            <div className='spotDetails1'>
                <h2>{spot.name}</h2>
                <h4>{spot.city} {spot.state}</h4>
                <div className='spotImages'>
                    {urls?.map(url=>(
                        <img src={url} alt="image"></img>
                    ))}
                </div>
            </div>
            <div className='spotDetails2'>
                <div className='spotDetails2Owner'>
                    <h2>Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</h2>
                    <p>{spot.description}</p>
                </div>
                <div className='spotDetails2Review'>
                    <div>
                        <h2>${spot.price}night</h2>
                        <i className="fa-solid fa-star fa-sm"></i>
                        <h2>{spot.avgStarRating}</h2>
                        <h2>·</h2>
                        <h2>{spot.numReviews? spot.numReviews:0} {rev}</h2>
                    </div>
                    <button onClick={()=>{window.alert("Feature Coming Soon...")}}>Reserve</button>
                </div>
            </div>
            <div className='spotDetails3'>
                <i className="fa-solid fa-star fa-sm"></i>
                <h2>{spot.avgStarRating}</h2>
                <div className={(spot.numReviews? "":"hidden") + " dot"}>
                    <h2>·</h2>
                    <h2>{spot.numReviews? spot.numReviews:0} {rev}</h2>
                </div>
            </div>
            <div className={reviewButtonClassName}>
                <button className='modalButton'>
                    <OpenModalMenuItem
                        itemText={spot.numReviews? "Post Your Review":"Be the first to post a review!"}
                        // onItemClick={}
                        modalComponent={<CreateReview spot={spot} sessionUser={sessionUser}/>}
                    />
                </button>
            </div>
            <div>
                {reviews.reverse().map(review=>(
                    <div>
                        <h3>{review?.User?.firstName}</h3>
                        <h4>{review?.createdAt}</h4>
                        <p>{review?.review}</p>
                        <button 
                            className={(review?.userId === sessionUser?.id ? "": "hidden") + " modalButton"}>
                            <OpenModalMenuItem
                            itemText="Delete"
                            // onItemClick={}
                            modalComponent={<DeleteReviewModal review={review}/>}
                            />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GetSpotDetails;