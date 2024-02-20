import Chart from 'chart.js/auto';
import {clarifyRootsByChord} from "../index";
import {fn, interval} from "../settings";

document.querySelector('main').innerHTML = '<canvas id="chart"></canvas>';
const ctx = (document.getElementById('chart') as HTMLCanvasElement).getContext('2d');
const { roots } = clarifyRootsByChord([interval])

const createLabels = (labelInterval: number[]) => {
  const labels = [];
  const step = 0.02;

  for (let i = labelInterval[0]; i <= labelInterval[1]; i += step) {
    labels.push(+Number(i).toFixed(7));
  }

  return labels;
}

const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [...createLabels(interval), ...roots].sort((a, b) => a - b),
    datasets: [
      {
        label: 'f(x)',
        borderWidth: 1,
        backgroundColor: 'green',
        borderColor: 'green',
        data: [],
        pointRadius: 1,
      },
        ...roots.map((root, index) => ({
          type: 'bubble' as const,
          label: `Root ${index + 1}`,
          borderWidth: 1,
          backgroundColor: 'red',
          data: [{x: root, y: 0}],
          pointRadius: 5,
        })),
    ],
  },
  plugins: [
    {
      id: 'function',
      beforeInit: function(chart) {
        const data = chart.config.data;

        data.datasets.forEach((_, i) => {
          data.labels.forEach((x: number) => {
            if (!roots.includes(x)) {
              const dataset = data.datasets[i];
              const y = fn(x);

              dataset.data.push(y);
            }
          });
        });
      }
    }
  ],
  options: {
    elements: {
      line: {
        tension: 0.5,
      }
    }
  }
});
