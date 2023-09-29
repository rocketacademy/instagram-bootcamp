import React from "react";

export default class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postComment: "",
    };
  }

  formatTime = (timestamp) => {
    const formatted = new Date(timestamp).toLocaleTimeString("en-GB", {
      hour12: true,
      hour: "numeric", // '2-digit' or 'numeric'
      minute: "2-digit", // 'numeric'
      year: "2-digit", // '2-digit' or 'numeric'
      month: "short", // 'short', 'narrow' or 'long'
      day: "2-digit", // '2-digit' or 'numeric'
    });
    return formatted;
  };

  handleChange = (e) => {
    const name = e.target.id;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  render() {
    return (
      <div className="" key={this.props.id}>
        <section className="bg-base-100  m-2 flex flex-col items-center justify-center rounded-xl shadow-xl">
          <figure>
            <img src={this.props.image} alt="nice" className="rounded-t-xl" />
          </figure>
          {/* Username + Image description */}
          <div className="w-full p-2 ">
            <h2 className="text-left font-bold">Username</h2>
            <p className="text-xs">{this.props.comment}</p>
          </div>
          <nav className="grid w-full grid-cols-2  px-2 pb-2">
            {/* Like, Comment, Delete and Timestamp */}
            <button className="text-left text-xs">🚀 13 </button>
            <button
              className="text-right text-xs text-slate-500 hover:text-slate-200"
              onClick={() => this.props.delete(this.props.id)}
            >
              delete
            </button>
            <button
              className="text-left text-xs"
              onClick={() => document.getElementById("my_modal_2").showModal()}
            >
              comment
            </button>
            <dialog id="my_modal_2" className="modal">
              <div className="modal-box">
                <h3 className="text-lg font-bold">Leave a comment!</h3>
                <p className="py-4">{this.props.comment}</p>
                <form className="mr-2 w-3/4">
                  <input
                    type="text"
                    className="input input-bordered w-full "
                    id="postComment"
                    value={this.state.postComment}
                    placeholder="Yay or Nay?"
                    onChange={this.handleChange}
                  ></input>
                </form>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>

            <p className="text-right text-[10px]">
              {this.formatTime(this.props.date)}
            </p>
          </nav>
        </section>
      </div>
    );
  }
}
