// import React, { Component } from "react";
// import Newsfeed from "./Newsfeed";
// import { Link } from "react-router-dom";
// import { Box, Container } from "@mui/material";
// import Button from "react-bootstrap/Button";
// import FormDialog from "./extras/FormDialog";

// export default class Home extends Component {
//   render() {
//     return (
//       <Container maxWidth={"xs"}>
//         {this.props.loggedInUser == null && (
//           <Link to="/login">
//             <Button
//               variant="contained"
//               style={{
//                 position: "absolute",
//                 top: "90%",
//                 left: "50%",
//                 transform: "translateX(-50%)",
//                 zIndex: 99,
//               }}
//             >
//               Log In or Sign Up
//             </Button>
//           </Link>
//         )}
//         <Box className={this.props.loggedInUser == null ? "paywall" : ""}>
//           <Newsfeed
//             messages={this.props.messages}
//             loggedInUser={this.props.loggedInUser}
//             handleLike={this.props.handleLike}
//           />
//           {this.props.loggedInUser != null && (
//             // <Composer {...this.props} />
//             <FormDialog {...this.props} />
//           )}
//         </Box>
//       </Container>
//     );
//   }
// }
