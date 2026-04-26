from handler import handler


def test_handler_returns_200():
    result = handler({}, {})
    assert result["statusCode"] == 200
