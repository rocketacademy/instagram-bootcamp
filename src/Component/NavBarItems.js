import LoginIcon from "@mui/icons-material/Login";
import CreateIcon from "@mui/icons-material/Create";
import FeedIcon from "@mui/icons-material/Feed";

export const NavBarItems = [
  {
    id: 0,
    icon: <LoginIcon />,
    label: "Login",
    route: "login",
  },
  {
    id: 1,
    icon: <CreateIcon />,
    label: "NewPost",
    route: "newpost",
  },
  {
    id: 2,
    icon: <FeedIcon />,
    label: "NewsFeed",
    route: "/",
  },
];
