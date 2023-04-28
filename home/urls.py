from django.urls import path

from . import views

urlpatterns = [
    path("", views.HomeView.as_view()),
    path("about/", views.AboutView.as_view()),
    path("contact/", views.ContactView.as_view()),
    path("creative-coding/", views.CreativeCodingView.as_view()),
    path("creative-coding/bouncing-balls/", views.BouncingBallsView.as_view()),
    path("creative-coding/starfield", views.StarfieldView.as_view()),
    path("games/", views.GamesView.as_view()),
    path("games/sudoku_backtrace", views.SudokuBacktraceView.as_view()),
    path("games/tictactoe", views.TicTacToeView.as_view()),
]
