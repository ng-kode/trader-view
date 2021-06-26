import React, { useEffect } from 'react';
import { Resizable } from "re-resizable";

const Chart = ({ chart_id, symbol, rsRating }) => {
    useEffect(() => {
        if (!window || !window.TradingView) {
            return;
        }

        const widget = new TradingView.widget(
            {
                "autosize": true,
                "symbol": symbol,
                "interval": "D",
                "timezone": "Etc/UTC",
                "theme": "light",
                "style": "1",
                "locale": "en",
                "toolbar_bg": "#f1f3f6",
                "enable_publishing": false,
                "hide_side_toolbar": false,
                "allow_symbol_change": true,
                "container_id": chart_id,
                "studies": [
                    {
                        "id": "MASimple@tv-basicstudies",
                        "inputs": { "length": 50 }
                    },
                    {
                        "id": "MASimple@tv-basicstudies",
                        "inputs": { "length": 200 }
                    },
                ]
            }
        );

        window.widget = widget;
    }, [window.TradingView, symbol])

    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Resizable
                style={{ background: "#f0f0f0" }}
                defaultSize={{ width: '95%', height: 240 }}
                enable={{ top: false, right: false, bottom: true, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
            >
                <div id={chart_id} style={{ height: '100%' }}></div>
            </Resizable>

            <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 32 }}>
                {rsRating}
            </div>
        </div>
    )
};

export default Chart;