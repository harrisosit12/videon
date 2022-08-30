import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { Typography, Box, Stack } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { Videos } from "./";
import { fetchAPI } from "../utils/fetchAPI";
import Moment from "react-moment";

const VideoDetail = () => {
  const [videoDetail, setVideoDetail] = useState(null);
  const [videos, setVideos] = useState([]);
  const [videoComments, setVideoComments] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchAPI(`videos?part=snippet,statistics&id=${id}`).then((data) =>
      setVideoDetail(data.items[0])
    );

    fetchAPI(`search?part=snippet&relatedToVideoId=${id}&type=video`).then(
      (data) => setVideos(data.items)
    );

    fetchAPI(`commentThreads?part=snippet&videoId=${id}`).then((data) =>
      setVideoComments(data)
    );
  }, [id]);

  if (!videoDetail?.snippet) return " Loading...";

  const {
    snippet: { title, channelId, channelTitle, publishedAt },
    statistics: { viewCount, likeCount },
  } = videoDetail;

  const { items } = videoComments;

  console.log(videoComments);
  return (
    <Box minHeight="95vh">
      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
      >
        <Box flex={1}>
          <Box sx={{ width: "100%", position: "sticky", top: "86px" }}></Box>
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${id}`}
            className="react-player"
            width="75%"
            height="75%"
            // playing
            controls
          />
          <Typography color="#fff" variant="h5" fontWeight="bold" p={2}>
            {title}
          </Typography>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ color: "#fff" }}
            py={1}
            px={2}
          >
            <Link to={`/channel/${channelId}`}>
              <Typography
                variant={{ sm: "subtitle1", md: "h6" }}
                color="#fff"
                fontWeight="bold"
              >
                {channelTitle}
                <CheckCircleIcon
                  sx={{ fontSize: "12px", color: "gray", ml: "5px" }}
                />
              </Typography>
            </Link>
            <Stack direction="row" gap="20px" alignItems="center">
              <Typography variant="body1" sx={{ opacity: 0.9, fontSize: 14 }}>
                {parseInt(viewCount).toLocaleString()} Views
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, fontSize: 14 }}>
                {parseInt(likeCount).toLocaleString()} Likes
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, fontSize: 14 }}>
                <Moment fromNow>{publishedAt}</Moment>
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="column" p={1} m={2}>
            <Typography
              variant="body1"
              sx={{ opacity: 0.9, fontSize: 17, color: "#ffff" }}
            >
              {items[0].snippet.topLevelComment.snippet.textDisplay}

              <Typography variant="body1" sx={{ opacity: 0.9, fontSize: 14 }}>
                <Moment fromNow>
                  {items[0].snippet.topLevelComment.snippet.updatedAt}
                </Moment>
              </Typography>
            </Typography>

            <Typography
              variant="body1"
              sx={{ opacity: 1, fontSize: 18, color: "#ffff" }}
            >
              {items[0].snippet.topLevelComment.snippet.authorDisplayName}
              <img
                src={
                  items[0].snippet.topLevelComment.snippet.authorProfileImgUrl
                }
                alt="url"
              />
            </Typography>
          </Stack>
        </Box>

        <Box
          px={2}
          py={{ md: 1, xs: 5 }}
          justifyContent="center"
          alignItems="center"
          sx={{ border: 1 }}
        >
          <Videos videos={videos} direction="column" />
        </Box>
      </Stack>
    </Box>
  );
};

export default VideoDetail;
