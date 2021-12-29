import { exec } from "child_process";
import React, { FC, useEffect, useState } from "react";
import { Text, Box } from "ink";

const App: FC<{ name?: string }> = () => {
	const [branches, setBranches] = useState<string[]>([]);
	const [currentBranch, setCurrentBranch] = useState<string | null>(null);

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
					<Box key={branch}>
						{isCurrentBranch ? (
							<Text color="yellow">&#62; </Text>
						) : (
							<Text>&nbsp; </Text>
						)}
						<Text color={isCurrentBranch ? "yellow" : "blue"}>{branch}</Text>
					</Box>
				);
			})}
		</>
	);
};

module.exports = App;
export default App;
