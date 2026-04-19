from flask import Blueprint, request, jsonify
from services.fd_service import generate_fd_insight, get_fd_comparison, calculate_fd


fd_bp = Blueprint('fd', __name__)

@fd_bp.route('/fd-options', methods=['GET'])
def fd_options():
    tenure = request.args.get("tenure", 12)
    risk   = request.args.get("risk", "medium")
    lang   = request.args.get("lang", "en")   # read language from query param

    result = get_fd_comparison(tenure)

    # AI Insight
    insight = generate_fd_insight(result["all_options"], risk, lang)

    return jsonify({
        "best_option": result["best_option"],
        "all_options": result["all_options"],
        "insight":     insight
    })


@fd_bp.route('/calculate', methods=['POST'])
def calculate():
    data = request.json

    amount = float(data["amount"])
    rate   = float(data["rate"])
    time   = float(data["time"])

    result = calculate_fd(amount, rate, time)

    return jsonify(result)