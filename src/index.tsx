import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ApolloProvider, gql } from '@apollo/client';
import client from './graphql/client';
import { IgrFinancialChart, IgrFinancialChartModule } from 'igniteui-react-charts';
import { StockIndexData } from './StockIndexData';

IgrFinancialChartModule.register();

interface DataItem {
  Volume: number;
  Close: number;
  Low: number;
  High: number;
  Open: number;
  Date: Date; // Adjusted to type Date since we are directly using Date objects now
  _id: string;
  __typename?: string;
}

const SUBSCRIBE_TO_UPDATES = gql`
subscription Subscription($graphId: ID!) {
  newGraphUpdate(graphId: $graphId) {
    Volume
    Close
    Low
    High
    Open
    Date
    _id
  }
}`;

interface FinancialChartStockIndexChartState {
  data: DataItem[];
}

class FinancialChartStockIndexChart extends React.Component<{}, FinancialChartStockIndexChartState> {
    subscription: any = null;

    constructor(props: {}) {
        super(props);
        this.state = { data: StockIndexData.getData() };
    }

    componentDidMount() {
        this.subscription = client.subscribe({ query: SUBSCRIBE_TO_UPDATES, variables: { graphId: '660915cdddf98d8c4b76baf9' }})
            .subscribe({
                next: async ({ data }) => {
                    if (data && data.newGraphUpdate) {
                        // Here you're setting a static date and _id, and copying other values from the update
                        const newData = {
                            "Volume": data.newGraphUpdate.Volume,
                            "Close": data.newGraphUpdate.Close,
                            "Low": data.newGraphUpdate.Low,
                            "High": data.newGraphUpdate.High,
                            "Open": data.newGraphUpdate.Open,
                            "Date": new Date(2020, 11, 27), // Months are 0-based
                            "_id": "66093e56144c44b87995a7e3",
                            "__typename": "GraphUpdate"
                        };
                        this.setState(prevState => ({
                            data: [...prevState.data, newData]
                        }));
                    }
                },
                error(err) { console.error('Subscription error:', err); },
            });
    }

    componentWillUnmount() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    render() {
        return (
            <ApolloProvider client={client}>
                <div className="container sample">
                    <div className="container">
                        <IgrFinancialChart
                            width="95%"
                            height="100%"
                            isToolbarVisible={false}
                            chartType="Candle"
                            chartTitle="Stock Index Chart"
                            titleAlignment="Left"
                            titleLeftMargin="25"
                            titleTopMargin="10"
                            titleBottomMargin="10"
                            subtitle="Real-time stock index chart fluctuation demonstration."
                            subtitleAlignment="Left"
                            subtitleLeftMargin="25"
                            subtitleTopMargin="5"
                            subtitleBottomMargin="10"
                            yAxisLabelLocation="OutsideLeft"
                            yAxisMode="Numeric"
                            yAxisTitle="Financial Prices"
                            yAxisTitleLeftMargin="10"
                            yAxisTitleRightMargin="5"
                            yAxisLabelLeftMargin="0"
                            zoomSliderType="None"
                            dataSource={this.state.data} />
                    </div>
                </div>
            </ApolloProvider>

        );
    }
}

// Rendering the FinancialChartStockIndexChart class to the React DOM
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<FinancialChartStockIndexChart />);
