import { exec } from "child_process";
import { FC, useContext, useState } from "react";
import { Text, Box, useInput } from "ink";
import { FullScreen } from "./components/FullScreen";
import { Mode, useModes } from "./hooks/useModes";
import TextInput from "ink-text-input";
import { BranchesContext } from "./components/BranchesProvider";
import { useSearch } from "./hooks/useSearch";

interface Branch {
	index: number;
	name: string;
}

const App: FC<{ name?: string }> = () => {
	const [selectedBranches, setSelectedBranches] = useState<Branch["index"][]>(
		[]
	);

	const { mode } = useModes();
	const {
		filteredBranches,
		increaseCurrentIndex,
		decreaseCurrentIndex,
		currentBranch,
	} = useContext(BranchesContext);
	const { searchTerm, search } = useSearch();

	useInput((input, key) => {
		if (!currentBranch) {
			return;
		}

		if (key.downArrow || input === "j") {
			increaseCurrentIndex();
		}

		if (key.upArrow || input === "k") {
			decreaseCurrentIndex();
		}

		if (input === "s") {
			const isSelected = selectedBranches.includes(currentBranch.index);

			if (isSelected) {
				setSelectedBranches(
					selectedBranches.filter((index) => index !== currentBranch.index)
				);
			} else {
				setSelectedBranches([...selectedBranches, currentBranch.index]);
			}
		}

		if (input === "d") {
			if (!selectedBranches.length) {
				return;
			}

			const branchNames = filteredBranches
				.filter(({ index }) => selectedBranches.includes(index))
				.map(({ name }) => name);

			const command = `git branch -D ${branchNames.join(" ")}`;

			exec(command, (error, stdout, stderr) => {
				if (error) {
					throw error;
				}
				if (stderr) {
					throw stderr;
				}

				console.log(stdout);
			});
		}

		if (input === "c") {
			const firstSelectedIndex = selectedBranches[0];

			if (firstSelectedIndex === undefined) {
				return;
			}

			const firstBranch = filteredBranches[firstSelectedIndex];

			if (!firstBranch) {
				return;
			}

			const command = `git checkout ${firstBranch.name}`;

			exec(command, (error, stdout, stderr) => {
				if (error) {
					throw error;
				}
				if (stderr) {
					throw stderr;
				}

				console.log(stdout);
			});
		}
	});

	return (
		<FullScreen>
			{mode === Mode.Search && (
				<TextInput value={searchTerm || ""} onChange={search} />
			)}
			{filteredBranches.map((branch) => {
				const isSelected = selectedBranches.includes(branch.index);

				return (
					<Box key={branch.name}>
						<Text
							color={branch.current ? "yellow" : "blue"}
							inverse={isSelected}
						>
							{branch.current ? <>&#62; </> : <>&nbsp; </>}
							{branch.name}
						</Text>
					</Box>
				);
			})}
		</FullScreen>
	);
};

module.exports = App;
export default App;
