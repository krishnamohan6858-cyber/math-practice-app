function QuestionCard({ question, onAnswer, index }) {
  return (
    <div>
      <h3>Q{index + 1}. {question.question}</h3>

      {question.type === "MCQ" ? (
        ["a", "b", "c", "d"].map(opt => (
          <button
            key={opt}
            onClick={() => onAnswer(question[`option_${opt}`])}
              style={{
                display: "block",
                margin: "10px 0",
                padding: "12px",
                width: "100%",
                cursor: "pointer",
                borderRadius: "10px",
                border: "none",
                background: "#f5f5f5",
                transition: "all 0.2s ease"
              }}
              onMouseOver={(e) => e.target.style.background = "#ddd"}
              onMouseOut={(e) => e.target.style.background = "#f5f5f5"}
              onMouseDown={(e) => e.target.style.transform = "scale(0.97)"}
              onMouseUp={(e) => e.target.style.transform = "scale(1)"}
          >
            {question[`option_${opt}`]}
          </button>
        ))
      ) : (
        <input
          placeholder="Enter answer"
          onBlur={(e) => onAnswer(e.target.value)}
          style={{ padding: "10px", width: "100%" }}
        />
      )}
    </div>
  );
}

export default QuestionCard;