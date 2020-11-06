import React, { PureComponent } from 'react';
import { PanelProps } from '@grafana/data';
import { PanelOptions, Frame } from 'types';
import Plotly from 'plotly.js-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
import { processData } from './util/process';

const Plot = createPlotlyComponent(Plotly);

interface Props extends PanelProps<PanelOptions> {}
interface State {
  data: Array<{
    x: number[];
    y: number[];
    z: number[];
    name: string;
    hovertemplate: string;
    type: string;
    mode: string;
    marker: object;
  }> | null;
}

export class MainPanel extends PureComponent<Props, State> {
  state: State = {
    data: null,
  };

  componentDidMount() {
    if (this.props.data.series.length == 7) {
      const series = this.props.data.series as Array<Frame>;
      const data = processData(series);
      this.setState({ data });
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.data.series !== this.props.data.series) {
      if (this.props.data.series.length == 7) {
        const series = this.props.data.series as Array<Frame>;
        const data = processData(series);
        this.setState({ data });
      } else {
        this.setState({ data: null });
      }
    }
  }

  render() {
    const { width, height } = this.props;
    const { data } = this.state;

    if (!data) return <div>No data</div>;

    return (
      <div
        style={{
          width,
          height,
        }}
      >
        <Plot
          data={data}
          layout={{
            width: width,
            height: height - 50,
            margin: {
              l: 50,
              r: 50,
              b: 0,
              t: 0,
              pad: 0,
            },
            scene: {
              aspectmode: 'auto',
              xaxis: { title: 'Duration' },
              yaxis: { title: 'Loyalty Rate' },
              zaxis: { title: 'Customer' },
              camera: {
                center: { x: 0, y: 0, z: 0 },
                eye: { x: 0.877, y: 1.924, z: 0.461 },
                up: { x: 0, y: 0, z: 1 },
              },
            },
            hoverlabel: {
              align: 'right',
              padding: {
                l: 10,
                r: 10,
                t: 10,
                b: 10,
              },
            },
          }}
          config={{ displayModeBar: false }}
        />
      </div>
    );
  }
}
