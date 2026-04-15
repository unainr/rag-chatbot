"use client";
import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { processPdfFile } from "@/lib/server/upload-documents";
type Props = {
	type: "error" | "success";
	text: string | null;
};
const PDFUpload = () => {
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<Props | null>(null);

	// TODO: handle file uplaod
	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setLoading(true);
		setMessage(null);
		try {
			const formData = new FormData();
			formData.append("pdf", file);
			const result = await processPdfFile(formData);
			if (result?.success) {
				setMessage({
					type: "success",
					text: result.message || "PDF processed successfully",
				});
				e.target.value = "";
			} else {
				setMessage({
					type: "error",
					text: result?.error || "Failed to process PDF",
				});
			}
		} catch (error) {
			setMessage({
				type: "error",
				text: "An error occurred while processing PDF",
			});
		} finally {
			setLoading(false);
		}
	};
	return (
		<>
			<div className="min-h-screen py-12 px-4">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-3xl font-bold mb-7 text-center">PDF Upload</h1>
					<Card className="mb-6">
						<CardContent className="pt-6 ">
							<div className="space-y-4">
								<Label htmlFor="pdf-uplaod">Uplaod PDF file</Label>
								<Input
									id="pdf-uplaod"
									className=" mt-2"
									type="file"
									accept=".pdf"
									onChange={handleFileUpload}
									disabled={loading}
								/>
								{loading && (
									<>
										<Spinner />
										<>Processing PDF...</>
									</>
								)}

								{message && (
									<Alert
										variant={
											message.type === "error" ? "destructive" : "default"
										}>
										<AlertTitle>
											{message.type === "error" ? "Error" : "Success!"}
										</AlertTitle>
										<AlertDescription>{message.text}</AlertDescription>
									</Alert>
								)}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	);
};

export default PDFUpload;
