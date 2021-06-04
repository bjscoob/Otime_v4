import React from "react";
import ButtonBase from "@material-ui/core/ButtonBase";

export default class JobBtn extends React.Component {
  constructor(props) {
    super(props);
    this.weekly = this.props.isWeekly ? "Weekly" : "Bi-Weekly";
  }

  render() {
    return (
      <div>
        <ButtonBase
          onClick={(event) => {
            this.props.setJobData(this.props.job);
          }}
        >
          <div class="jobRow">
            <div
              style={{
                fontSize: (this.props.fontSize / 2).toString() + "px",
                marginBottom: "5px"
              }}
            >
              {this.props.job.name}
            </div>
            <div class="jobDesc">
              {" "}
              {"$" + Number(this.props.job.payrate).toFixed(2) + " /hr"} <br />
              {this.weekly}
            </div>
            <input
              type="image"
              class="editJobBtn"
              alt="Edit Job"
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMjQiIGhlaWdodD0iMjQiCnZpZXdCb3g9IjAgMCAyMjYgMjI2IgpzdHlsZT0iIGZpbGw6IzAwMDAwMDsiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0wLDIyNnYtMjI2aDIyNnYyMjZ6IiBmaWxsPSJub25lIj48L3BhdGg+PGcgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTE3My4zOTkwOCwxOC44MzMzM2MtMi40MDk0OCwwIC00LjgyMTYzLDAuOTE3ODMgLTYuNjU3ODgsMi43NTg3OWwtMTYuMDc0NTQsMTYuMDc0NTRsMzcuNjY2NjcsMzcuNjY2NjdsMTYuMDc0NTQsLTE2LjA3NDU0YzMuNjgxOTIsLTMuNjgxOTIgMy42ODE5MiwtOS42NDMyNiAwLC0xMy4zMTU3NmwtMjQuMzUwOTEsLTI0LjM1MDkxYy0xLjg0MDk2LC0xLjg0MDk2IC00LjI0ODQsLTIuNzU4NzkgLTYuNjU3ODgsLTIuNzU4Nzl6TTEzNi41NDE2Nyw1MS43OTE2N2wtODkuNDU4MzMsODkuNDU4MzNjMCwwIDkuNDYzNzUsMC4wNDcwOCAxNC4xMjUsNC43MDgzM2M0LjY2MTI1LDQuNjYxMjUgNC41NjEyLDEzLjk3Nzg2IDQuNTYxMiwxMy45Nzc4NmMwLDAgOS42MDE0NywwLjE4NDggMTQuMjcyMTQsNC44NTU0N2M0LjY3MDY3LDQuNjcwNjcgNC43MDgzMywxNC4xMjUgNC43MDgzMywxNC4xMjVsODkuNDU4MzMsLTg5LjQ1ODMzek0zNC41NTg0MywxNjAuMDgzMzNsLTYuMzA4NDMsMzcuNjY2NjdsMzcuNjY2NjcsLTYuMzA4NDN6Ij48L3BhdGg+PC9nPjwvZz48L3N2Zz4="
            />
          </div>
        </ButtonBase>
      </div>
    );
  }
}
