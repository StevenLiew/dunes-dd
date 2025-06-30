import { useState, useEffect } from "react";
import { X, Plus, Settings, RotateCcw, Home } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import Navbar, { Footer } from "./Navbar";

interface DropdownOption {
  id: string;
  label: string;
  color: string;
  hasSubOptions?: boolean;
  restrictedRows?: string[]; // Rows where this option is allowed
}

interface HouseOption {
  id: string;
  name: string;
  icon?: string; // URL to house icon
}

// Utility to generate house options from image filenames
const houseImageFiles = [
  "Alexin.webp",
  "Argosaz.webp",
  "Dyvetz.webp",
  "Ecaz.webp",
  "Hagal.webp",
  "Hurata.webp",
  "Imota.webp",
  "Kenola.webp",
  "Lindaren.webp",
  "Maros.webp",
  "Mikarrol.webp",
  "Moritani.webp",
  "Mutelli.webp",
  "Novebruns.webp",
  "Richese.webp",
  "Sor.webp",
  "Spinette.webp",
  "Taligari.webp",
  "Thorvald.webp",
  "Tseida.webp",
  "Varota.webp",
  "Vernius.webp",
  "Wallach.webp",
  "Wayku.webp",
  "Wydras.webp",
];

function getHouseOptionsFromImages() {
  return houseImageFiles.map((filename) => {
    const name = filename.replace(".webp", "");
    return {
      id: name.toLowerCase(),
      name: `House ${name}`,
      icon: `/${filename}`,
    };
  });
}

// Supabase setup
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function App({ viewOnly = false }: { viewOnly?: boolean }) {
  // House options from images
  const [houseOptions] = useState<HouseOption[]>(getHouseOptionsFromImages());

  // Default dropdown options with specified colors and restrictions
  const [dropdownOptions, setDropdownOptions] = useState<DropdownOption[]>([
    { id: "lab", label: "Lab", color: "text-blue-400" },
    { id: "shipwreck", label: "Shipwreck", color: "text-green-400" },
    { id: "titanium", label: "Titanium", color: "text-red-400" },
    { id: "stravidium", label: "Stravidium", color: "text-gray-300" },
    { id: "wormring", label: "Worm Ring", color: "text-purple-300" },
    {
      id: "house",
      label: "House",
      color: "text-orange-400",
      hasSubOptions: true,
    },
    {
      id: "fwdbase",
      label: "Fwd Base",
      color: "text-yellow-400",
      restrictedRows: ["A", "B", "C", "D", "E"],
    },
  ]);

  // Grid state - stores selected options for each cell
  const [gridData, setGridData] = useState<
    Map<string, Array<{ optionId: string; houseId?: string }>>
  >(new Map());

  // Modal states
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [newOptionLabel, setNewOptionLabel] = useState("");
  const [showHouseDropdown, setShowHouseDropdown] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState<string>("");
  const [isViewOnly] = useState(viewOnly);
  const [nextStormDate, setNextStormDate] = useState<Date | null>(
    new Date("2025-06-30T19:00:00+08:00")
  );
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [mapId, setMapId] = useState<string | null>(null);
  const [deletedCells, setDeletedCells] = useState<string[]>([]);

  const rows = ["I", "H", "G", "F", "E", "D", "C", "B", "A"];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  // Get all selected house IDs (for uniqueness)
  const selectedHouseIds = Array.from(gridData.values())
    .flat()
    .filter((sel) => sel.optionId === "house" && sel.houseId)
    .map((sel) => sel.houseId);

  const handleCellClick = (row: string, col: number) => {
    if (isViewOnly) return; // Prevent interaction in view-only mode
    const cellId = `${row}-${col}`;
    setSelectedCell(cellId);
    setShowHouseDropdown(false);
    setSelectedHouse("");
  };

  const handleOptionSelect = (
    cellId: string,
    optionId: string,
    houseId?: string
  ) => {
    const currentSelections = gridData.get(cellId) || [];
    const existingIndex = currentSelections.findIndex(
      (sel) => sel.optionId === optionId && sel.houseId === houseId
    );
    let newSelections;
    if (existingIndex >= 0) {
      // Remove existing selection
      newSelections = currentSelections.filter(
        (_, index) => index !== existingIndex
      );
    } else {
      // Add new selection
      newSelections = [...currentSelections, { optionId, houseId }];
    }
    const newGridData = new Map(gridData);
    if (newSelections.length === 0) {
      newGridData.delete(cellId);
      setDeletedCells((prev) => [...prev, cellId]);
    } else {
      newGridData.set(cellId, newSelections);
    }
    setGridData(newGridData);
  };

  const handleHouseSelection = (cellId: string, houseId: string) => {
    handleOptionSelect(cellId, "house", houseId);
    setShowHouseDropdown(false);
    setSelectedHouse("");
  };

  const addNewOption = () => {
    if (newOptionLabel.trim()) {
      const newOption: DropdownOption = {
        id: Date.now().toString(),
        label: newOptionLabel.trim(),
        color: "text-gray-300",
      };
      setDropdownOptions([...dropdownOptions, newOption]);
      setNewOptionLabel("");
    }
  };

  const removeOption = (optionId: string) => {
    // Don't allow removing default options
    const defaultIds = [
      "lab",
      "shipwreck",
      "titanium",
      "stravidium",
      "wormring",
      "house",
      "fwdbase",
    ];
    if (defaultIds.includes(optionId)) return;

    setDropdownOptions(dropdownOptions.filter((opt) => opt.id !== optionId));
    // Remove from all grid selections
    const newGridData = new Map();
    gridData.forEach((selections, cellId) => {
      const filteredSelections = selections.filter(
        (sel) => sel.optionId !== optionId
      );
      if (filteredSelections.length > 0) {
        newGridData.set(cellId, filteredSelections);
      }
    });
    setGridData(newGridData);
  };

  const resetMap = () => {
    if (
      confirm(
        "Are you sure you want to reset the entire map? This action cannot be undone."
      )
    ) {
      setGridData(new Map());
      setIsManageModalOpen(false);
    }
  };

  const getCellSelections = (row: string, col: number) => {
    const cellId = `${row}-${col}`;
    const selections = gridData.get(cellId) || [];
    return selections
      .map((sel) => {
        const option = dropdownOptions.find((opt) => opt.id === sel.optionId);
        if (!option) return null;

        let displayLabel = option.label;
        let icon: string | undefined = undefined;
        if (sel.houseId && option.id === "house") {
          const house = houseOptions.find((h) => h.id === sel.houseId);
          displayLabel = house
            ? house.name.replace(/^House\s+/, "")
            : option.label;
          icon = house?.icon;
        }

        return {
          ...option,
          displayLabel,
          houseId: sel.houseId,
          icon,
        };
      })
      .filter(Boolean);
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case "text-blue-400":
        return "bg-blue-400";
      case "text-green-400":
        return "bg-green-400";
      case "text-white":
        return "bg-white";
      case "text-cyan-300":
        return "bg-cyan-300";
      case "text-purple-300":
        return "bg-purple-300";
      case "text-orange-400":
        return "bg-orange-400";
      case "text-yellow-400":
        return "bg-yellow-400";
      case "text-red-400":
        return "bg-red-400";
      default:
        return "bg-gray-300";
    }
  };

  const isOptionSelected = (
    cellId: string,
    optionId: string,
    houseId?: string
  ) => {
    const selections = gridData.get(cellId) || [];
    return selections.some(
      (sel) => sel.optionId === optionId && sel.houseId === houseId
    );
  };

  const isOptionAvailable = (optionId: string, row: string) => {
    const option = dropdownOptions.find((opt) => opt.id === optionId);
    if (!option || !option.restrictedRows) return true;
    return option.restrictedRows.includes(row);
  };

  const updateOptionRestrictions = (optionId: string, newRows: string[]) => {
    setDropdownOptions((prev) =>
      prev.map((opt) =>
        opt.id === optionId ? { ...opt, restrictedRows: newRows } : opt
      )
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (nextStormDate) {
        const now = new Date();
        const distance = nextStormDate.getTime() - now.getTime();
        if (distance < 0) {
          setTimeRemaining("The storm has passed.");
          clearInterval(interval);
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [nextStormDate]);

  const addNextStormDate = (dateString: string) => {
    const newDate = new Date(dateString);
    if (!isNaN(newDate.getTime())) {
      setNextStormDate(newDate);
    }
  };

  // Load from Supabase on mount
  useEffect(() => {
    const loadFromSupabase = async () => {
      // 1. Get the first map
      const { data: maps, error: mapError } = await supabase
        .from("maps")
        .select("id")
        .order("created_at", { ascending: true })
        .limit(1);
      if (mapError || !maps || maps.length === 0) return;
      const mapId = maps[0].id;
      setMapId(mapId);

      // 2. Load grid_cells
      const { data: cells } = await supabase
        .from("grid_cells")
        .select("cell_id, selections")
        .eq("map_id", mapId);
      if (cells) {
        const newGrid = new Map();
        cells.forEach((cell) => {
          newGrid.set(cell.cell_id, cell.selections);
        });
        setGridData(newGrid);
      }

      // 3. Load dropdown_options
      const { data: options } = await supabase
        .from("dropdown_options")
        .select("option_id, label, color, has_sub_options, restricted_rows");
      if (options) {
        setDropdownOptions(
          options.map((opt) => ({
            id: opt.option_id,
            label: opt.label,
            color: opt.color,
            hasSubOptions: opt.has_sub_options,
            restrictedRows: opt.restricted_rows,
          }))
        );
      }

      // 4. Load settings (nextStormDate)
      const { data: settings } = await supabase
        .from("settings")
        .select("next_storm_date")
        .eq("map_id", mapId)
        .order("created_at", { ascending: false })
        .limit(1);
      if (settings && settings.length > 0 && settings[0].next_storm_date) {
        setNextStormDate(new Date(settings[0].next_storm_date));
      }
    };
    loadFromSupabase();
  }, []);

  // Save to Supabase when gridData, dropdownOptions, or nextStormDate changes
  useEffect(() => {
    if (!mapId) return;
    const saveToSupabase = async () => {
      // 1. Save grid_cells
      const cells = Array.from(gridData.entries()).map(
        ([cell_id, selections]) => ({
          map_id: mapId,
          cell_id,
          selections,
          updated_at: new Date().toISOString(),
        })
      );
      // Upsert all cells
      if (cells.length > 0) {
        await supabase
          .from("grid_cells")
          .upsert(cells, { onConflict: "map_id,cell_id" });
      }
      // Delete removed cells
      if (deletedCells.length > 0) {
        await supabase
          .from("grid_cells")
          .delete()
          .in("cell_id", deletedCells)
          .eq("map_id", mapId);
        setDeletedCells([]);
      }

      // 2. Save dropdown_options
      const options = dropdownOptions.map((opt) => ({
        map_id: mapId,
        option_id: opt.id,
        label: opt.label,
        color: opt.color,
        has_sub_options: !!opt.hasSubOptions,
        restricted_rows: opt.restrictedRows,
        updated_at: new Date().toISOString(),
      }));
      if (options.length > 0) {
        await supabase
          .from("dropdown_options")
          .upsert(options, { onConflict: "map_id,option_id" });
      }

      // 3. Save settings (nextStormDate)
      if (nextStormDate) {
        await supabase.from("settings").upsert(
          [
            {
              map_id: mapId,
              next_storm_date: nextStormDate.toISOString(),
              updated_at: new Date().toISOString(),
            },
          ],
          { onConflict: "map_id" }
        );
      }
    };
    saveToSupabase();
  }, [gridData, dropdownOptions, nextStormDate, mapId, deletedCells]);

  // Remove all controls and modals in view-only mode
  if (isViewOnly) {
    return (
      <div className="min-h-screen bg-black text-white p-4 md:p-8">
        <Navbar />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-bold mb-2 text-orange-400 tracking-wide">
              DUNE AWAKENING
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-orange-300 mb-4">
              Deep Desert Map
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Created by{" "}
              <a
                href="https://github.com/StevenLiew"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-orange-400 hover:text-orange-300"
              >
                Steven Liew (Gwen)
              </a>
            </p>
          </div>

          {/* Countdown Timer Section */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-red-600">
              Next Coriolis Storm
            </h3>
            <p className="text-lg">{timeRemaining}</p>
          </div>

          {/* Legend */}
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl mb-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-4 text-center text-orange-300">
              Legend
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {dropdownOptions
                .filter((option) => option.id !== "house")
                .map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg"
                  >
                    <div
                      className={`w-4 h-4 rounded-full ${getColorClass(
                        option.color
                      )} shadow-lg`}
                    ></div>
                    <span className={`${option.color} font-medium text-sm`}>
                      {option.label}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Grid Container */}
          <div className="bg-gray-900 p-6 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
            <div className="w-full">
              <div className="min-w-[600px]">
                {/* Top axis labels */}
                <div className="grid grid-cols-11 gap-1 mb-3">
                  <div></div>
                  {cols.map((col) => (
                    <div key={col} className="text-center font-bold text-lg">
                      <span className="text-orange-300">{col}</span>
                    </div>
                  ))}
                  <div></div>
                </div>

                {/* Grid with side labels */}
                {rows.map((row) => (
                  <div key={row} className="grid grid-cols-11 gap-1 mb-1">
                    {/* Left axis label */}
                    <div className="flex items-center justify-center font-bold text-lg text-orange-300">
                      {row}
                    </div>

                    {/* Grid cells */}
                    {cols.map((col) => {
                      const cellSelections = getCellSelections(row, col);
                      return (
                        <div
                          key={`${row}-${col}`}
                          className={`aspect-square bg-gray-800 border-2 border-gray-600 transition-all duration-300 flex flex-col items-center justify-center p-2 min-h-[70px] rounded-lg`}
                        >
                          <div
                            className={`text-xs font-semibold mb-2 text-gray-400 transition-colors`}
                          ></div>
                          {cellSelections.length > 0 && (
                            <div className="flex flex-wrap gap-1 justify-center items-center h-full w-full min-h-[32px] min-w-[32px]">
                              {cellSelections.map((selection, index) =>
                                selection &&
                                selection.icon &&
                                selection.houseId ? (
                                  <img
                                    key={`${selection.id}-${
                                      selection.houseId || ""
                                    }-${index}`}
                                    src={selection.icon}
                                    alt={selection.displayLabel}
                                    title={selection.displayLabel}
                                    className="w-6 h-6 rounded-full border border-gray-600 shadow-md bg-black object-contain"
                                  />
                                ) : selection ? (
                                  <div
                                    key={`${selection.id}-${
                                      selection.houseId || ""
                                    }-${index}`}
                                    className={`w-3 h-3 rounded-full ${getColorClass(
                                      selection.color
                                    )} shadow-md border border-gray-600 flex items-center justify-center`}
                                    title={selection.displayLabel}
                                  ></div>
                                ) : null
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Right axis label */}
                    <div className="flex items-center justify-center font-bold text-lg text-orange-300">
                      {row}
                    </div>
                  </div>
                ))}

                {/* Bottom axis labels */}
                <div className="grid grid-cols-11 gap-1 mt-3">
                  <div></div>
                  {cols.map((col) => (
                    <div key={col} className="text-center font-bold text-lg">
                      <span
                        className={
                          col === 2 || col === 5 || col === 8
                            ? "border-b-4 border-pink-500 pb-1 px-2 text-orange-300"
                            : "text-orange-300"
                        }
                      >
                        {col}
                      </span>
                    </div>
                  ))}
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 text-orange-400 tracking-wide">
            DUNE AWAKENING
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-orange-300 mb-4">
            Deep Desert Map
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Created by{" "}
            <a
              href="https://github.com/StevenLiew"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-orange-400 hover:text-orange-300"
            >
              Steven Liew (Gwen)
            </a>
          </p>

          {/* Control Buttons */}
          {!isViewOnly && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setIsManageModalOpen(true)}
                className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-2 shadow-lg"
              >
                <Settings size={20} />
                Manage Options
              </button>
            </div>
          )}
        </div>

        {/* Countdown Timer Section */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-red-600">
            Next Coriolis Storm
          </h3>
          <p className="text-lg">{timeRemaining}</p>
        </div>

        {/* Legend */}
        <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl mb-8 shadow-2xl">
          <h3 className="text-2xl font-bold mb-4 text-center text-orange-300">
            Legend
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {dropdownOptions
              .filter((option) => option.id !== "house")
              .map((option) => (
                <div
                  key={option.id}
                  className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg"
                >
                  <div
                    className={`w-4 h-4 rounded-full ${getColorClass(
                      option.color
                    )} shadow-lg`}
                  ></div>
                  <span className={`${option.color} font-medium text-sm`}>
                    {option.label}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Grid Container */}
        <div className="bg-gray-900 p-6 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
          <div className="w-full">
            <div className="min-w-[600px]">
              {/* Top axis labels */}
              <div className="grid grid-cols-11 gap-1 mb-3">
                <div></div>
                {cols.map((col) => (
                  <div key={col} className="text-center font-bold text-lg">
                    <span className="text-orange-300">{col}</span>
                  </div>
                ))}
                <div></div>
              </div>

              {/* Grid with side labels */}
              {rows.map((row) => (
                <div key={row} className="grid grid-cols-11 gap-1 mb-1">
                  {/* Left axis label */}
                  <div className="flex items-center justify-center font-bold text-lg text-orange-300">
                    {row}
                  </div>

                  {/* Grid cells */}
                  {cols.map((col) => {
                    const cellSelections = getCellSelections(row, col);
                    return (
                      <div
                        key={`${row}-${col}`}
                        className={`aspect-square bg-gray-800 border-2 border-gray-600 ${
                          !isViewOnly
                            ? "hover:border-orange-400 cursor-pointer hover:bg-gray-700 hover:shadow-lg hover:shadow-orange-400/20 transform hover:scale-105"
                            : ""
                        } transition-all duration-300 flex flex-col items-center justify-center p-2 min-h-[70px] rounded-lg group`}
                        onClick={() => handleCellClick(row, col)}
                      >
                        <div
                          className={`text-xs font-semibold mb-2 text-gray-400 ${
                            !isViewOnly ? "group-hover:text-orange-300" : ""
                          } transition-colors`}
                        ></div>
                        {cellSelections.length > 0 && (
                          <div className="flex flex-wrap gap-1 justify-center items-center h-full w-full min-h-[32px] min-w-[32px]">
                            {cellSelections.map((selection, index) =>
                              selection &&
                              selection.icon &&
                              selection.houseId ? (
                                <img
                                  key={`${selection.id}-${
                                    selection.houseId || ""
                                  }-${index}`}
                                  src={selection.icon}
                                  alt={selection.displayLabel}
                                  title={selection.displayLabel}
                                  className="w-6 h-6 rounded-full border border-gray-600 shadow-md bg-black object-contain"
                                />
                              ) : selection ? (
                                <div
                                  key={`${selection.id}-${
                                    selection.houseId || ""
                                  }-${index}`}
                                  className={`w-3 h-3 rounded-full ${getColorClass(
                                    selection.color
                                  )} shadow-md border border-gray-600 flex items-center justify-center`}
                                  title={selection.displayLabel}
                                ></div>
                              ) : null
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Right axis label */}
                  <div className="flex items-center justify-center font-bold text-lg text-orange-300">
                    {row}
                  </div>
                </div>
              ))}

              {/* Bottom axis labels */}
              <div className="grid grid-cols-11 gap-1 mt-3">
                <div></div>
                {cols.map((col) => (
                  <div key={col} className="text-center font-bold text-lg">
                    <span
                      className={
                        col === 2 || col === 5 || col === 8
                          ? "border-b-4 border-pink-500 pb-1 px-2 text-orange-300"
                          : "text-orange-300"
                      }
                    >
                      {col}
                    </span>
                  </div>
                ))}
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cell Selection Modal */}
      {selectedCell && !isViewOnly && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 p-6 rounded-xl max-w-md w-full border border-gray-700 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-orange-300">
                Sector {selectedCell}
              </h3>
              <button
                onClick={() => {
                  setSelectedCell(null);
                  setShowHouseDropdown(false);
                  setSelectedHouse("");
                }}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X size={24} />
              </button>
            </div>

            {!showHouseDropdown ? (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {dropdownOptions.map((option) => {
                  const currentRow = selectedCell.split("-")[0];
                  const isAvailable = isOptionAvailable(option.id, currentRow);

                  if (!isAvailable) return null;

                  if (option.id === "house") {
                    return (
                      <button
                        key={option.id}
                        onClick={() => setShowHouseDropdown(true)}
                        className="w-full flex items-center gap-3 hover:bg-gray-800 p-3 rounded-lg transition-all duration-200 border border-transparent hover:border-gray-600"
                      >
                        <Home size={20} className={option.color} />
                        <div className="w-4 h-4 rounded-full bg-orange-400 shadow-md"></div>
                        <span className={`${option.color} font-medium text-lg`}>
                          {option.label}
                        </span>
                        <span className="ml-auto text-gray-400">→</span>
                      </button>
                    );
                  }

                  const isSelected = isOptionSelected(selectedCell, option.id);
                  return (
                    <label
                      key={option.id}
                      className="flex items-center gap-3 cursor-pointer hover:bg-gray-800 p-3 rounded-lg transition-all duration-200 border border-transparent hover:border-gray-600"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() =>
                          handleOptionSelect(selectedCell, option.id)
                        }
                        className="w-5 h-5 rounded accent-orange-500"
                      />
                      <div
                        className={`w-4 h-4 rounded-full ${getColorClass(
                          option.color
                        )} shadow-md`}
                      ></div>
                      <span className={`${option.color} font-medium text-lg`}>
                        {option.label}
                      </span>
                      {option.restrictedRows && (
                        <span className="ml-auto text-xs bg-gray-600 px-2 py-1 rounded text-gray-300">
                          Row {option.restrictedRows.join(",")} only
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => setShowHouseDropdown(false)}
                    className="text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    ← Back
                  </button>
                  <span className="text-orange-300 font-semibold">
                    Select House
                  </span>
                </div>
                {houseOptions.map((house) => {
                  const isSelected = isOptionSelected(
                    selectedCell,
                    "house",
                    house.id
                  );
                  const isDisabled =
                    !isSelected && selectedHouseIds.includes(house.id);
                  return (
                    <label
                      key={house.id}
                      className={`flex items-center gap-3 cursor-pointer hover:bg-gray-800 p-3 rounded-lg transition-all duration-200 border border-transparent hover:border-gray-600 ${
                        isDisabled ? "opacity-50 pointer-events-none" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={isDisabled}
                        onChange={() =>
                          handleHouseSelection(selectedCell, house.id)
                        }
                        className="w-5 h-5 rounded accent-orange-500"
                      />
                      <div className="w-4 h-4 rounded-full bg-orange-400 shadow-md"></div>
                      <span className="text-orange-400 font-medium text-lg">
                        {house.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setSelectedCell(null);
                  setShowHouseDropdown(false);
                  setSelectedHouse("");
                }}
                className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Options Modal */}
      {isManageModalOpen && !isViewOnly && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 p-6 rounded-xl max-w-lg w-full border border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-orange-300">
                Manage Options
              </h3>
              <button
                onClick={() => setIsManageModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X size={24} />
              </button>
            </div>

            {/* Reset Map Section */}
            <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg">
              <h4 className="text-lg font-semibold mb-3 text-red-400">
                Reset Map
              </h4>
              <p className="text-sm text-gray-300 mb-3">
                This will clear all selections from the map. This action cannot
                be undone.
              </p>
              <button
                onClick={resetMap}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
              >
                <RotateCcw size={16} />
                Reset Map
              </button>
            </div>

            {/* Row Restrictions Management */}
            <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
              <h4 className="text-lg font-semibold mb-3 text-yellow-400">
                Row Restrictions
              </h4>
              <p className="text-sm text-gray-300 mb-3">
                Manage which rows can use specific options (e.g., Fwd Base
                currently restricted to row A)
              </p>
              {dropdownOptions
                .filter((opt) => opt.restrictedRows)
                .map((option) => (
                  <div
                    key={option.id}
                    className="mb-3 p-3 bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-3 h-3 rounded-full ${getColorClass(
                          option.color
                        )}`}
                      ></div>
                      <span className={`${option.color} font-medium`}>
                        {option.label}
                      </span>
                    </div>
                    <div className="text-sm text-gray-300">
                      Current restrictions: Row{" "}
                      {option.restrictedRows?.join(", ")}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {rows.map((row) => (
                        <button
                          key={row}
                          onClick={() => {
                            const currentRows = option.restrictedRows || [];
                            const newRows = currentRows.includes(row)
                              ? currentRows.filter((r) => r !== row)
                              : [...currentRows, row];
                            updateOptionRestrictions(option.id, newRows);
                          }}
                          className={`px-2 py-1 text-xs rounded transition-colors ${
                            option.restrictedRows?.includes(row)
                              ? "bg-yellow-600 text-white"
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          }`}
                        >
                          {row}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
            </div>

            {/* Add new option */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3 text-orange-300">
                Add New Option
              </h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newOptionLabel}
                  onChange={(e) => setNewOptionLabel(e.target.value)}
                  placeholder="Enter option name"
                  className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 focus:border-orange-500 focus:outline-none transition-colors"
                  onKeyPress={(e) => e.key === "Enter" && addNewOption()}
                />
                <button
                  onClick={addNewOption}
                  disabled={!newOptionLabel.trim()}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* Current options */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3 text-orange-300">
                Current Options
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {dropdownOptions.map((option) => {
                  const isDefault = [
                    "lab",
                    "shipwreck",
                    "titanium",
                    "stravidium",
                    "wormring",
                    "house",
                    "fwdbase",
                  ].includes(option.id);
                  return (
                    <div
                      key={option.id}
                      className="flex items-center justify-between bg-gray-800 p-3 rounded-lg border border-gray-700"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full ${getColorClass(
                            option.color
                          )} shadow-md`}
                        ></div>
                        <span className={`${option.color} font-medium`}>
                          {option.label}
                        </span>
                        {isDefault && (
                          <span className="text-xs bg-orange-600 px-2 py-1 rounded text-white">
                            Default
                          </span>
                        )}
                        {option.restrictedRows && (
                          <span className="text-xs bg-yellow-600 px-2 py-1 rounded text-white">
                            {option.restrictedRows.join(",")}
                          </span>
                        )}
                      </div>
                      {!isDefault && (
                        <button
                          onClick={() => removeOption(option.id)}
                          className="text-red-400 hover:text-red-300 p-1 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add Next Storm Date Section */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3 text-orange-300">
                Set Next Storm Date/Time
              </h4>
              <input
                type="datetime-local"
                onChange={(e) => addNextStormDate(e.target.value)}
                className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 focus:border-orange-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsManageModalOpen(false)}
                className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default App;
