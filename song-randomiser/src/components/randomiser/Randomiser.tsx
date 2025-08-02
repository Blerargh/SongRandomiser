import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import data from '../../assets/songs.json';

interface SongDetails {
  song: string;
  category: string;
  artist: string;
  bpm: number | null;
  imageLink: string;
  diffName: string;
  displayLevel: string;
  internalLevel: number;
  noteDesigner: string;
  noteCount: number;
}

const Randomiser: React.FC = () => {
  // Song data
  const [songData, setSongData] = useState<SongDetails[]>(data.songs);
  const [filteredData, setFilteredData] = useState<SongDetails[]>([]);

  // Display data
  const [randomised, setRandomised] = useState<SongDetails[]>([]);

  // Filter Options
  const options = [
    {
      name: 'Swiss Round 1 (13.0 - 13.4)',
      lowerBound: 13.0,
      upperBound: 13.4,
      value: '13.0-13.4',
    },
    {
      name: 'Swiss Round 2 (13.2 - 13.7)',
      lowerBound: 13.2,
      upperBound: 13.7,
      value: '13.2-13.7',
    },
    {
      name: 'Swiss Round 3 (13.6 - 14.1)',
      lowerBound: 13.6,
      upperBound: 14.1,
      value: '13.6-14.1',
    },
    {
      name: 'Swiss Round 4 (13.8 - 14.3)',
      lowerBound: 13.8,
      upperBound: 14.3,
      value: '13.8-14.3',
    },
    {
      name: 'Grand Finals Match 1 (14.0 - 14.4)',
      lowerBound: 14.0,
      upperBound: 14.4,
      value: '14.0-14.4',
    },
    {
      name: 'Grand Finals Match 2 (14.2 - 14.6)',
      lowerBound: 14.2,
      upperBound: 14.6,
      value: '14.2-14.6',
    },
    {
      name: 'Grand Finals Match 3 (14.4 - 14.8)',
      lowerBound: 14.4,
      upperBound: 14.8,
      value: '14.4-14.8',
    },
    {
      name: 'Grand Finals Match 4 (14.6 - 14.9)',
      lowerBound: 14.6,
      upperBound: 14.9,
      value: '14.6-14.9',
    },
  ];

  // Filter data
  const [selectedOption, setSelectedOption] = useState<string>(
    options[0].value
  );

  // Pick/Ban states
  // 0 - Picks not yet randomised, 1 - High seed pick, 2 - Low Seed ban, 3 - Mid seed pick, 4 - Complete
  const [currentAction, setCurrentAction] = useState<number>(0);
  const actions = [
    '',
    'HIGH Seed to PICK',
    'LOW Seed to BAN',
    'MID Seed to PICK',
    '',
  ];

  const [pickBanStates, setPickBanStates] = useState<string[]>([
    '',
    '',
    '',
    '',
    '',
  ]);

  // Animation Key for reanimation
  const [animationKey, setAnimationKey] = useState<number>(0);

  // Toggle Remove button display
  const [displayRemove, setDisplayRemove] = useState<boolean>(false);

  // Randomise
  const handleClick = () => {
    // 5 random picks
    const indexes = new Set<number>();
    while (indexes.size < 5) {
      const rand = Math.floor(Math.random() * filteredData.length);
      indexes.add(rand);
    }

    // Retrieve the 5 random picks
    const newRandomised: SongDetails[] = [];
    for (const index of Array.from(indexes)) {
      newRandomised.push(filteredData[index]);
    }

    setRandomised(newRandomised);
    setPickBanStates(['', '', '', '', '']);
    setCurrentAction(1);
    setAnimationKey((animationKey) => animationKey + 1);
  };

  // Option selection
  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedOption(value);
    setRandomised([]);
    setPickBanStates(['', '', '', '', '']);
    setCurrentAction(0);
  };

  const handleFilter = (value: string) => {
    // Get constant bounds
    const bounds = value.split('-');
    const lowerBound = parseFloat(bounds[0]);
    const upperBound = parseFloat(bounds[1]);

    // Filter based on constants
    const filtered = songData.filter(
      (song) =>
        song.internalLevel <= upperBound && song.internalLevel >= lowerBound
    );
    setFilteredData(filtered);
  };

  useEffect(() => {
    handleFilter(selectedOption);
  }, [selectedOption, songData]);

  // Handle Pick/Ban action
  const handleAction = (event: React.MouseEvent<HTMLDivElement>) => {
    if (currentAction >= 4 || currentAction <= 0) return; // Invalid
    const selection = parseInt(event.currentTarget.id.slice(-1));

    if (currentAction % 2 === 1) {
      // Picking
      setPickBanStates((state) => {
        const newState = [...state];
        newState[selection] = 'PICKED';
        return newState;
      });
    } else {
      // Banning
      setPickBanStates((state) => {
        const newState = [...state];
        newState[selection] = 'BANNED';
        return newState;
      });
    }

    setCurrentAction((currentAction) => currentAction + 1);
  };

  // Undo actions (in case of misclicks)
  const handleReset = () => {
    setCurrentAction(1);
    setPickBanStates(['', '', '', '', '']);
  };

  // Remove selected picks
  useEffect(() => {
    if (currentAction === 4) {
      setDisplayRemove(true);
    } else {
      setDisplayRemove(false);
    }
  }, [currentAction]);

  const handleRemove = () => {
    const pickedSongs: string[] = [];
    for (const pickedSong of randomised as SongDetails[]) {
      pickedSongs.push(pickedSong.song);
    }
    setSongData(songData.filter((song) => !pickedSongs.includes(song.song)));
    setRandomised([]);
    setCurrentAction(0);
  };

  return (
    <div id="randomiser-container" className="flex flex-col">
      <div
        id="randomiser-details"
        className="flex justify-center items-center my-2"
      >
        <strong
          className={
            currentAction % 2 === 1 ? 'text-green-400' : 'text-red-400'
          }
        >
          {actions[currentAction]}
        </strong>
      </div>
      <div id="randomiser-songs" className="flex flex-row">
        {randomised.map((song, index) => (
          <motion.div
            key={`${animationKey}-${song}-${index}`}
            id={`selection-${index}`}
            className={`flex flex-col w-[200px] overflow-hidden p-2 m-2 ${pickBanStates[index] === '' && currentAction !== 4 && 'hover:scale-105 transition'}`}
            onClick={pickBanStates[index] === '' ? handleAction : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.3, duration: 1 }}
          >
            <div>
              <img
                className="object-cover cursor-pointer"
                src={song.imageLink}
              />
            </div>
            <div className="flex flex-col items-center justify-center text-sm">
              <h2 className="font-bold mt-3">Title</h2>
              <p className={`break-all text-center`}>{song.song}</p>
              <h2 className="font-bold mt-3">Artist</h2>
              <p className="break-all text-center">{song.artist}</p>
              <h2 className="break-all mt-3 font-bold">
                <span
                  className={
                    song.diffName === 'MASTER'
                      ? 'text-purple-300'
                      : 'text-red-600'
                  }
                >
                  {song.diffName} {song.displayLevel}
                </span>{' '}
                ({song.internalLevel.toFixed(1)})
              </h2>
              <h2
                className={`font-bold mt-3 ${pickBanStates[index] === 'PICKED' && 'text-green-400'} ${pickBanStates[index] === 'BANNED' && 'text-red-400'}`}
              >
                {pickBanStates[index]}
              </h2>
            </div>
          </motion.div>
        ))}
      </div>
      <div
        id="randomiser-buttons"
        className="flex flex-row items-center mt-5 justify-center"
      >
        <select
          id="select-dropdown"
          className="p-2 m-3 rounded-xl bg-white text-black"
          onChange={handleSelect}
          value={selectedOption}
        >
          {options.map((option) => (
            <option
              key={option.name}
              value={option.value}
              className="text-black"
            >
              {option.name}
            </option>
          ))}
        </select>
        <button
          className="bg-green-700 mx-1 px-3 py-2 rounded-xl cursor-pointer hover:bg-green-800 active:bg-green-900 transition"
          onClick={handleClick}
        >
          Randomise!
        </button>
        {currentAction !== 0 && (
          <button
            className="bg-blue-700 mx-1 px-3 py-2 rounded-xl cursor-pointer hover:bg-blue-800 active:bg-blue-900 transition"
            onClick={handleReset}
          >
            Reset
          </button>
        )}
        {displayRemove && (
          <button
            className="bg-red-700 mx-1 px-3 py-2 rounded-xl cursor-pointer hover:bg-red-800 active:bg-red-900 transition"
            onClick={handleRemove}
          >
            Remove
          </button>
        )}
      </div>
      <div
        id="randomiser-pool-details"
        className="flex justify-center items-center m-0  "
      >
        <p className="italic text-gray-400 text-sm">
          {filteredData.length} songs in selected pool
        </p>
      </div>
    </div>
  );
};

export default Randomiser;
