//-----------Imports-----------//
import React from "react";
//-----------Components-----------//
import Post from "./Post";

//-----------Firebase-----------//
import { database, storage, auth } from "../../firebase/firebase";

import {
  onChildAdded,
  onChildRemoved,
  push,
  ref,
  remove,
} from "firebase/database";

import { uploadBytes, ref as sRef, getDownloadURL } from "firebase/storage";

// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   onAuthStateChanged,
//   signOut,
// } from "firebase/auth";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling
const DB_POST_KEY = "postList";

export default class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: "",
      likes: 0,
      postList: [],
      file: null,
      // email: "",
      // password: "",
    };
  }
  // Update feed/chat on changes
  componentDidMount() {
    const postRef = ref(database, DB_POST_KEY);
    // onChildAdded will return data for every child at the reference and every subsequent new child
    onChildAdded(postRef, (data) => {
      this.setState((state) => ({
        postList: [...state.postList, { key: data.key, ...data.val() }],
      }));
    });
    onChildRemoved(postRef, (data) => {
      console.log("child removed:", data.val());
      const newPostList = this.state.postList.filter(
        (post) => post.key !== data.key,
      );
      // Add the subsequent child to local component state, initialising a new array to trigger re-render
      this.setState({
        postList: newPostList,
      });
    });
  }

  writeData = () => {
    //Push image into database
    const fileRef = sRef(storage, `image/${this.state.file.name}`);
    console.log("Is this working");
    uploadBytes(fileRef, this.state.file)
      .then(() => {
        return getDownloadURL(fileRef);
      })
      .then((url) => {
        console.log(url);
        //Add posts and final url AFTER images url generated
        const postListRef = ref(database, DB_POST_KEY);
        push(postListRef, {
          comment: this.state.comment,
          date: `${new Date()}`,
          image: url,
        });
      })
      // Clear input fields
      .then(() => {
        this.setState({ comment: "", file: null });
      });
  };

  handleChange = (e) => {
    const name = e.target.id;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  fileChange = (e) => {
    console.log(e.target.files[0]);
    this.setState({ file: e.target.files[0] });
  };

  handleDelete = (id) => {
    const postRef = ref(database, `${DB_POST_KEY}/${id}`);
    remove(postRef);
  };

  render() {
    return (
      <div className="flex h-max min-h-[93vh] w-screen flex-col bg-red-100 ">
        <article className="mb-4 flex flex-grow flex-col items-center justify-center ">
          {/* <button
            onClick={() => {
              return createUserWithEmailAndPassword(auth, email, password).then(
                (userInfo) => console.log(userInfo),
              );
            }}
          >
            Signup
          </button> */}
          <div className=" w-12/12 grid max-h-[100vh] grid-cols-2 overflow-y-auto md:grid-cols-3 lg:grid-cols-4">
            {this.state.postList.map((post) => (
              <Post
                key={post.key}
                id={post.key}
                comment={post.comment}
                image={post.image}
                date={post.date}
                delete={this.handleDelete}
              />
            ))}
          </div>
          {/* Input */}

          <button
            className="btn fixed bottom-16 m-2 bg-slate-100 opacity-90 shadow-xl hover:animate-bounce"
            onClick={() => document.getElementById("my_modal_2").showModal()}
          >
            Share your daily Rocket 🚀
          </button>
          <dialog id="my_modal_2" className="modal">
            <div className="modal-box">
              <section className=" flex w-full flex-row justify-center">
                <form onSubmit={this.writeData} className="mr-2 w-3/4">
                  <input
                    type="text"
                    className="input input-bordered w-full "
                    value={this.state.comment}
                    id="comment"
                    placeholder="What are you doing now?"
                    onChange={this.handleChange}
                  ></input>
                  <input
                    type="file"
                    className="file-input file-input-bordered mt-1 w-full"
                    placeholder="x"
                    onChange={this.fileChange}
                  ></input>
                </form>
                <button className="btn h-24" onClick={this.writeData}>
                  Send
                </button>
              </section>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        </article>
      </div>
    );
  }
}
