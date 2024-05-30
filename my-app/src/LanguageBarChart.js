import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const LanguageBarChart = ({ languages }) => {
  const sortedLanguages = Object.entries(languages).sort(([, countA], [, countB]) => countB - countA);
  const labels = sortedLanguages.map(([language]) => language);
  const data = sortedLanguages.map(([, count]) => count);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Lines of Code',
        data: data,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Programming Languages Usage',
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default LanguageBarChart;
