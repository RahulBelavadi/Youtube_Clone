// menuData.js
import HomeIcon from '@mui/icons-material/Home';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import HistoryIcon from '@mui/icons-material/History';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import StreamIcon from '@mui/icons-material/Stream';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SchoolIcon from '@mui/icons-material/School';
import PodcastsIcon from '@mui/icons-material/Podcasts';






export const homeMenu = [
    {
        icon: <HomeIcon />,
        name: "Home",
        path: "/"         // <-- add path here
    },
    {
        icon: <VideoCameraFrontIcon />,
        name: "Shorts"
    },
    {
        icon: <SubscriptionsIcon />,
        name: "Subscription"
    }
];


export const History = [
    {
        icon: <HistoryIcon />,
        name: "History"
    },
    {
        icon: <PlaylistPlayIcon />,
        name: "Playlist"
    },
    {
        icon: <AccessTimeIcon />,
        name: "Watch Later"
    },
      {
        icon: <ThumbUpIcon />,
        name: "Liked Videos"
    }
];



export const Explore = [
    {
        icon: <WhatshotIcon />,
        name: "History"
    },
    {
        icon: <LocalMallIcon />,
        name: "Playlist"
    },
    {
        icon: <MusicNoteIcon />,
        name: "Watch Later"
    },
      {
        icon: <MovieFilterIcon />,
        name: "Liked Videos"
    },
    {
        icon: <StreamIcon />,
        name: "Live"
    },
    {
        icon: <SportsEsportsIcon />,
        name: "Gaming"
    },
    {
        icon: <NewspaperIcon />,
        name: "News"
    },
     {
        icon: <EmojiEventsIcon />,
        name: "Sports"
    },
     {
        icon: <SchoolIcon />,
        name: "Education"
    },
     {
        icon: <PodcastsIcon />,
        name: "Podcast"
    }
];

