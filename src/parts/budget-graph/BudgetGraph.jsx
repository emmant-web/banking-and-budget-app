import './BudgetGraph.css';
import * as React from 'react';
import { PieChart, pieArcLabelClasses} from '@mui/x-charts/PieChart';


const BudgetGraph = ({ rows }) => {
    if (!rows || rows.length === 0) {
        return <div>No data available</div>;
    } else {
        const TOTAL = rows.map((item) => item.price).reduce((a, b) => a + b, 0);
        let pieData = rows.map(item => ({
            id: item.id,
            value: item.price,
            label: `${item.expense} (${((item.price / TOTAL) * 100).toFixed(2)}%)` ,
        }))
        ;
    return (
        <PieChart
            series={[
                {
                data: pieData, 
                },
            ]}
            
            margin={{ right: 10, left: 10, top: 0, bottom:150 }}
            width={400}
            height={600}
            slotProps={{
                legend: {
                  direction: 'row',
                  position: { vertical: 'bottom', horizontal: 'middle' },
                  padding: 0,
                  labelStyle:{
                    fontSize: 16
                  },
                  itemMarkWidth: 11,
                  itemMarkHeight: 10,
                },
              }}
            sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fill: 'white',
                  fontSize: 14,
                },
                ['.MuiChartsLegend-series']: {
                    gap: '17px',
                  }
              }}
        />
    );
    }
};

export default BudgetGraph;