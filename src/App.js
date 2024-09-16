import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Theme, Heading, Flex } from "@radix-ui/themes";
import * as Switch from "@radix-ui/react-switch";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Main from "./Pages/main";
import Favorite from "./Pages/favoritePage";
import "./App.css";
import "@radix-ui/themes/styles.css";

function App() {
  const [isMetric, setIsMetric] = useState(false);

  const toggleTemperatureUnit = () => {
    setIsMetric((prevIsMetric) => !prevIsMetric);
  };

  return (
    <BrowserRouter>
      <>
        <Heading
          trim="normal"
          style={{
            background: "var(--gray-a2)",
            borderTop: "1px dashed var(--gray-a7)",
            borderBottom: "1px dashed var(--gray-a7)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px",
          }}
        >
          <Flex align="stretch" direction="row" gap="5">
            Every Weather&nbsp;
            <form>
              <div style={{ display: "flex", alignItems: "center" }}>
                {/* Your form elements */}
              </div>
            </form>
          </Flex>
          <Flex align="center" direction="row" gap="10">
            <form>
              <div style={{ display: "flex", alignItems: "center" }}>
                <label
                  className="Label"
                  htmlFor="airplane-mode"
                  style={{ paddingRight: 15 }}
                >
                  Metric
                </label>
                <Switch.Root
                  className="SwitchRoot"
                  onCheckedChange={toggleTemperatureUnit}
                  checked={isMetric}
                >
                  <Switch.Thumb className="SwitchThumb" />
                </Switch.Root>
              </div>
            </form>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>...</DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content>
                  <Link to="/">
                    <DropdownMenu.Item>Main</DropdownMenu.Item>
                  </Link>
                  <Link to="/Favorite">
                    <DropdownMenu.Item>Favorites</DropdownMenu.Item>
                  </Link>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </Flex>
        </Heading>

        <Routes>
          <Route path="/" element={<Main isMetric={isMetric} />} />
          <Route path="/Favorite" element={<Favorite isMetric={isMetric} />} />
          {/* Fallback route to handle undefined routes */}
          <Route path="*" element={<Main isMetric={isMetric} />} />
        </Routes>
      </>
    </BrowserRouter>
  );
}

export default App;