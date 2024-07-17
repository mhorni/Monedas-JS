
const converter = document.querySelector("#converter");
converter.addEventListener("submit", (e) => {
  e.preventDefault();
  convertValue();
  converter.reset();
});

const convertValue = async function () {
  try {
    const valor = Number(document.querySelector("#valor").value);
    const moneda = document.querySelector("#moneda").value;
    if (valor && moneda != " seleccionar ") {
      const response = await obtenerDatos(moneda);
      const apiValue = response.serie[0].valor;
      const days = response.serie
        .map((d) => {
          return (setDate = d.fecha.split("T", 1));
        })
        .slice(0, 10)
        .reverse();
      const values = response.serie
        .map((v) => v.valor)
        .slice(0, 10)
        .reverse();
      

      
      await resultConvertion(valor, apiValue);
      
      await renderChart(days, values, moneda);
    } else {
      return alert("ingresar un valor");
    }
  } catch (error) {
    return alert("error en datos");
  }
};


async function obtenerDatos(moneda) {
  const res = await fetch(`https://mindicador.cl/api/${moneda}`);
  if (!res.ok) {
    throw new Error("error intenta de nuevo");
  } else {
    return await res.json();
  }
}

async function resultConvertion(userValue, apiValue) {
  const convertedValue = userValue / apiValue;
  document.querySelector(
    "#resultado"
  ).textContent = `El valor es: ${convertedValue.toFixed(2)}`;
}

let chart;
async function renderChart(days, values, moneda) {
  const ctx = document.getElementById("chart");
  
    if (chart) {
        chart.destroy();
    }

  chart = new Chart(ctx, {
    type: "line",
    data: {
    labels: days,

  datasets: [{
                label: `Historial últimos 10 días (${moneda})`,
                data: values,
                borderColor: 'blue',
                borderWidth: 8,
                pointBackgroundColor: 'blue',
                pointBorderColor: 'blue'
            }]
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        color: 'black' 
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)' 
                    }
                },
                y: {
                    ticks: {
                        color: 'black' 
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'black'
                    }
                }
            }
        }
    });
}






