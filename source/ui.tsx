import { exec } from "child_process";
import React, { FC, useEffect, useState } from "react";
import { Text, Box, useInput, useApp } from "ink";

interface Branch {
	index: number;
	name: string;
}

const App: FC<{ name?: string }> = () => {
	const { exit } = useApp();
	const [branches, setBranches] = useState<Branch[]>([]);
	const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
	const [selectedBranches, setSelectedBranches] = useState<Branch["index"][]>(
		[]
	);

	useInput((input, key) => {
		if (!currentBranch) {
			return;
		}

		if (key.downArrow || input === "j") {
			const currentIndex = currentBranch.index;
			const nextIndex = currentIndex + 1;

			if (nextIndex > branches.length - 1) {
				return;
			}

			const nextBranch = branches[nextIndex];

			if (!nextBranch) {
				return;
			}

			setCurrentBranch(nextBranch);
		}

		if (key.upArrow || input === "k") {
			const currentIndex = currentBranch.index;
			const nextIndex = currentIndex - 1;

			if (nextIndex < 0) {
				return;
			}

			const nextBranch = branches[nextIndex];

			if (!nextBranch) {
				return;
			}

			setCurrentBranch(nextBranch);
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

			const branchNames = branches
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
				exit();
			});
		}

		if (input === "c") {
			const firstSelectedIndex = selectedBranches[0];

			if (firstSelectedIndex === undefined) {
				return;
			}

			const firstBranch = branches[firstSelectedIndex];

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
				exit();
			});
		}
	});

	useEffect(() => {
		exec("git branch", (error, stdout, stderr) => {
			if (error) {
				throw error;
			}
			if (stderr) {
				throw stderr;
			}

			const parsedBranches = stdout
				.replace("*", "")
				.split("\n")
				.map((branch) => branch.replace(/\s/g, ""))
				.filter((branch) => !!branch)
				.map((branch, index) => ({ index, name: branch }))
				.sort();

			setBranches(parsedBranches);

			const firstBranch = parsedBranches[0];

			if (!firstBranch) {
				throw new Error("No first branch found!");
			}

			setCurrentBranch(firstBranch);
		});
	}, []);

	return (
		<>
			{branches.map((branch) => {
				const isCurrentBranch = branch === currentBranch;
				const isSelected = selectedBranches.includes(branch.index);

				return (
					<Box key={branch.name}>
						<Text
							color={isCurrentBranch ? "yellow" : "blue"}
							inverse={isSelected}
						>
							{isCurrentBranch ? <>&#62; </> : <>&nbsp; </>}
							{branch.name}
						</Text>
					</Box>
				);
			})}
		</>
	);
};

module.exports = App;
export default App;
