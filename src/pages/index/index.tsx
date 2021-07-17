import React, { MouseEvent, ReactNode } from "react";
import ReactDOM from 'react-dom';
import '@/pages/app.less';

interface Props {
  Content: ReactNode
}

interface State {
  num: number
}

class App extends React.Component<Props, State> {
  readonly state: Readonly<State> = {
    num: 0
  }

  private handleClick = (e: MouseEvent<HTMLElement>) => {
    // console.log(e);
    const { opera } = e.currentTarget.dataset;
    let num = this.state.num;
    if (opera === "+") {
      num++;
    } else if (opera === '-') {
      num--;
    }
    this.setState({ num });
  }

  render(): any {
    const { num } = this.state;
    const { Content } = this.props;
    return (
      <div>
        <h1>hello laynegu!!!</h1>
        {Content}
        <button onClick={this.handleClick} data-opera="+">add</button>
        {num}
        <button onClick={this.handleClick} data-opera="-">sub</button>
        <br />
        <a href="./log.html">跳转</a>
      </div>
    )
  }
}

ReactDOM.render(<App Content={<div>counter</div>} />, document.getElementById("root"));
