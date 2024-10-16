import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Registrar los elementos y el plugin de DataLabels
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const Grafico = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      // Configuración de DataLabels para mostrar porcentajes
      datalabels: {
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce((acc, val) => acc + val, 0);
          const percentage = ((value / total) * 100).toFixed(2);
          return `${percentage}%`; // Mostrar porcentaje con 2 decimales
        },
        color: "#fff", // Color del texto
        font: {
          weight: "bold", // Opcional: negrita
        },
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default Grafico;
