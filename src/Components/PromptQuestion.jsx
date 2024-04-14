/* eslint-disable react/prop-types */
import { useState } from 'react';

import {
	Box,
	Card,
	CardContent,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography,
} from '@mui/material';

const PromptQuestion = ({
	question,
	questionNumber,
	updateQuestionFeedback,
}) => {
	const { prompt, id } = question;
	const [grade, setGrade] = useState('');

	const selectColor =
		grade === 6.25
			? 'green'
			: grade === 4.6875
			? 'gold'
			: grade === 3.125
			? 'darkorange'
			: 'red';

	const handleFeedbackChange = (e, feedbackType) => {
		if (feedbackType === 'grade') {
			setGrade(e.target.value);
		}
		updateQuestionFeedback(questionNumber, feedbackType, e.target.value);
	};

	return (
		<Card
			sx={{
				mb: 0,
				p: 1,
				border: 1,
				borderColor: '#F3B6B6',
				borderStyle: 'solid',
			}}
		>
			<CardContent>
				<Typography
					color='primary'
					sx={{
						fontWeight: 700,
					}}
				>
					Question {questionNumber}:
				</Typography>{' '}
				{prompt}
				<Box
					sx={{
						minWidth: 150,
						mt: 2,
					}}
				>
					<FormControl fullWidth>
						<InputLabel id='grade-select-label'>Grade</InputLabel>
						<Select
							labelId='grade-select-label'
							id='grade-select'
							value={grade}
							label='Grade'
							sx={{ color: selectColor, fontWeight: 600, mb: 3 }}
							onChange={(e) => {
								handleFeedbackChange(e, 'grade');
							}}
						>
							<MenuItem value={6.25} sx={{ color: 'green', fontWeight: 600 }}>
								Exceptional
							</MenuItem>
							<MenuItem value={4.6875} sx={{ color: 'gold', fontWeight: 600 }}>
								Proficient
							</MenuItem>
							<MenuItem
								value={3.125}
								sx={{ color: 'darkorange', fontWeight: 600 }}
							>
								Developing
							</MenuItem>
							<MenuItem value={1.5625} sx={{ color: 'red', fontWeight: 600 }}>
								Novice
							</MenuItem>
						</Select>
						<TextField
							id='interviewer-comment'
							label='Comment'
							name='comment'
							value={comment}
							multiline
							placeholder='Comment'
							onChange={handleChange}
							sx={{ mb: 1 }}
						/>
					</FormControl>
				</Box>
				<Box
					sx={{
						// minWidth: 150,
						mt: 2,
						// border: 1,
					}}
				>
					<FormControl fullWidth>
						<TextField
							id='interviewer-comments'
							label='Interviewer Comments'
							multiline
							variant='outlined'
							onChange={(e) => {
								handleFeedbackChange(e, 'notes');
							}}
							// placeholder='Interviewer comments...'
						/>
					</FormControl>
				</Box>
			</CardContent>
		</Card>
	);
};

export default PromptQuestion;
