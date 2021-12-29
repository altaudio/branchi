import { exec } from "child_process";
import React, { FC, useEffect, useState } from "react";
import { Text, Box, useInput } from "ink";

interface Branch {
	index: number;
	name: string;
}

const App: FC<{ name?: string }> = () => {
	const [branches, setBranches] = useState<Branch[]>([]);
	const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);

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
				return (
					<Box key={branch.name}>
						{isCurrentBranch ? (
							<Text color="yellow">&#62; </Text>
						) : (
							<Text>&nbsp; </Text>
						)}
						<Text color={isCurrentBranch ? "yellow" : "blue"}>
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
