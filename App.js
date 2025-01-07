import React, { useState } from 'react';
import axios from 'axios';
import ChessBoardComponent from './components/Chessboard';
import { Circles } from 'react-loader-spinner';

function App() {
    const [gameUrl, setGameUrl] = useState('');
    const [analysisData, setAnalysisData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0)

    const handleInputChange = (e) => {
        setGameUrl(e.target.value);
    };

    const handleAnalyze = async () => {
        setLoading(true);
        setAnalysisData(null)
        setError(null)
        try {
            const response = await axios.post('http://127.0.0.1:5000/analyze', {
                game_url: gameUrl,
            });
            setAnalysisData(response.data.analysis);
            setCurrentMoveIndex(0)
        } catch (error) {
            setError(error.message || 'An error occurred during analysis.');
        } finally {
            setLoading(false);
        }
    };

    const handleNextMove = () =>{
      if(analysisData && currentMoveIndex < analysisData.length -1){
        setCurrentMoveIndex(currentMoveIndex + 1);
      }
    }

    const handlePreviousMove = () => {
       if(analysisData && currentMoveIndex > 0){
        setCurrentMoveIndex(currentMoveIndex - 1)
      }
    }

    const onMove = (sourceSquare, targetSquare) => {
        console.log("Move made", sourceSquare, targetSquare)
    }

    const getEvaluation = () =>{
         if(analysisData){
            return analysisData[currentMoveIndex].score
        }
        return "Not yet analyzed"
    }


    const getBestMove = () => {
        if(analysisData && analysisData[currentMoveIndex].best_move){
            return analysisData[currentMoveIndex].best_move
        }
      return "Not yet analyzed"
    }

    const getCurrentFen = () =>{
      if(analysisData){
        return analysisData[currentMoveIndex].fen
      }
      return "start";
    }


    return (
        <div className="flex flex-col items-center p-4">
            <h1 className="text-2xl font-bold mb-4">Chess Game Analyzer</h1>

            {/* Input */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Enter PGN URL"
                    value={gameUrl}
                    onChange={handleInputChange}
                    className="border p-2 rounded"
                />
                <button
                    onClick={handleAnalyze}
                    className="bg-blue-500 text-white py-2 px-4 rounded ml-2"
                    disabled={loading}
                >
                  {loading? "Loading...": "Analyze"}
                </button>
            </div>

            {/* Loading */}
            {loading && (
                    <div className='flex justify-center items-center'>
                    <Circles
                      height="80"
                      width="80"
                      color="#4fa94d"
                      ariaLabel="circles-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                      visible={true}
                    />
                 </div>
            )}

            {/* Error */}
            {error && <p className="text-red-500">{error}</p>}

            {/* Analysis Display */}
            {analysisData && (
                <div className="mt-4">
                  <div className='flex mb-4'>
                      <button
                          onClick={handlePreviousMove}
                          className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
                          disabled={currentMoveIndex <= 0}
                       >
                         Previous
                      </button>
                        <button
                            onClick={handleNextMove}
                           className="bg-gray-500 text-white py-2 px-4 rounded ml-2"
                           disabled={currentMoveIndex >= analysisData.length -1}
                           >
                             Next
                      </button>
                  </div>

                    <div className='flex justify-center mb-4'>
                         <ChessBoardComponent fen={getCurrentFen()} onMove={onMove}/>
                    </div>

                    <p>Evaluation: {getEvaluation()}</p>
                    <p>Best move: {getBestMove()}</p>
                </div>
            )}
        </div>
    );
}

export default App;